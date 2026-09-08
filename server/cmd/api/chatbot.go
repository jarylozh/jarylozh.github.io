package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/openai/openai-go/v3"
)

const (
	roleUser      = "user"
	roleAssistant = "assistant"
)

const (
	maxRequestBytes    = 8 << 10
	maxQuestionRunes   = 500
	maxContentRunes    = 2000
	maxHistoryMessages = 12

	maxCompletionTokens = 500
)

const systemPrompt = `You are Jaryl Ong, replying to visitors on your own portfolio site.
Speak in the first person as Jaryl, in a plain and grounded voice.
Use only the context you are given. Never invent details about yourself; if the
context does not cover the question, say you do not know and point the visitor
at the portfolio page.
Keep answers short. Use one paragraph, or two separated by a blank line
when the answer covers genuinely separate points.

When one project is the main subject of your answer, append its card marker
from the context on its own line at the very end, for example
[[project:vault-of-cards]]. Use at most one marker per answer, only for
projects listed in the context, and never describe the marker itself.

When the visitor asks for your resume or CV, append [[resume]] instead. Use at
most one marker of either kind per answer.`

type chatRequest struct {
	Message string        `json:"message"`
	History []chatMessage `json:"history"`
}

type chatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type chatDelta struct {
	Delta string `json:"delta"`
}

type chatError struct {
	Message string `json:"message"`
}

func (app *application) chatHandler(w http.ResponseWriter, r *http.Request) {
	req, err := app.readChatRequest(w, r)
	if err != nil {
		if writeErr := app.writeJSON(w, http.StatusBadRequest, chatError{Message: err.Error()}, nil); writeErr != nil {
			app.logger.Print(writeErr)
		}
		return
	}

	if app.budget.exhausted() {
		app.logger.Print("daily token budget exhausted")

		writeErr := app.writeJSON(w, http.StatusServiceUnavailable,
			chatError{Message: "I have hit my daily limit, try again tomorrow"}, nil)
		if writeErr != nil {
			app.logger.Print(writeErr)
		}
		return
	}

	// Order matters: validation must fail before any header is written.
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("X-Accel-Buffering", "no")

	rc := http.NewResponseController(w)
	if err := rc.SetWriteDeadline(time.Time{}); err != nil {
		app.logger.Printf("clearing write deadline: %s", err)
	}

	stream := app.openai_client.Chat.Completions.NewStreaming(r.Context(), openai.ChatCompletionNewParams{
		Model:               openai.ChatModelGPT4o,
		Messages:            buildMessages(req, app.context),
		MaxCompletionTokens: openai.Int(maxCompletionTokens),
		StreamOptions: openai.ChatCompletionStreamOptionsParam{
			IncludeUsage: openai.Bool(true),
		},
	})

	defer stream.Close()

	acc := openai.ChatCompletionAccumulator{}
	var deltas int

	for stream.Next() {
		chunk := stream.Current()
		acc.AddChunk(chunk)

		if len(chunk.Choices) == 0 || chunk.Choices[0].Delta.Content == "" {
			continue
		}

		if !app.writeSSE(w, rc, "", chatDelta{Delta: chunk.Choices[0].Delta.Content}) {
			return
		}
		deltas++
	}

	tokens := app.recordUsage(&acc, req)

	if err := stream.Err(); err != nil {
		app.logger.Printf("chat stream failed after %d deltas, %d tokens: %s", deltas, tokens, err)
		app.writeSSE(w, rc, "error", chatError{Message: "the assistant is unavailable"})
		return
	}

	fmt.Fprint(w, "data: [DONE]\n\n")
	rc.Flush()
	app.logger.Printf("chat reply in %d deltas, %d history messages, %d tokens", deltas, len(req.History), tokens)
}

func (app *application) readChatRequest(w http.ResponseWriter, r *http.Request) (chatRequest, error) {
	var req chatRequest

	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBytes)

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(&req); err != nil {
		var maxBytes *http.MaxBytesError
		if errors.As(err, &maxBytes) {
			return req, fmt.Errorf("body must not exceed %d bytes", maxRequestBytes)
		}
		return req, errors.New("body must be valid json")
	}

	req.Message = strings.TrimSpace(req.Message)
	if req.Message == "" {
		return req, errors.New("message is required")
	}

	if len([]rune(req.Message)) > maxQuestionRunes {
		return req, fmt.Errorf("message must be %d characters or fewer", maxQuestionRunes)
	}

	req.History = sanitizeHistory(req.History)

	return req, nil
}

func sanitizeHistory(history []chatMessage) []chatMessage {
	kept := make([]chatMessage, 0, len(history))

	for _, message := range history {
		if message.Role != roleUser && message.Role != roleAssistant {
			continue
		}

		content := strings.TrimSpace(message.Content)
		if content == "" {
			continue
		}

		if runes := []rune(content); len(runes) > maxContentRunes {
			content = string(runes[:maxContentRunes])
		}

		kept = append(kept, chatMessage{Role: message.Role, Content: content})
	}

	if len(kept) > maxHistoryMessages {
		kept = kept[len(kept)-maxHistoryMessages:]
	}

	return kept
}

// buildMessages assembles the system prompt, portfolio context, prior turns,
// and the new question, with the instructions ahead of the context.
func buildMessages(req chatRequest, context string) []openai.ChatCompletionMessageParamUnion {
	messages := make([]openai.ChatCompletionMessageParamUnion, 0, len(req.History)+2)
	messages = append(messages, openai.SystemMessage(systemPrompt+"\n\nContext about me:\n"+context))

	for _, message := range req.History {
		if message.Role == roleUser {
			messages = append(messages, openai.UserMessage(message.Content))
			continue
		}
		messages = append(messages, openai.AssistantMessage(message.Content))
	}

	return append(messages, openai.UserMessage(req.Message))
}

// writeSSE marshals payload into one SSE frame and flushes it.
// Returns false once the client has gone away.
func (app *application) writeSSE(w http.ResponseWriter, rc *http.ResponseController, event string, payload any) bool {
	body, err := json.Marshal(payload)
	if err != nil {
		app.logger.Printf("marshal sse payload: %s", err)
		return false
	}

	if event != "" {
		fmt.Fprintf(w, "event: %s\n", event)
	}

	if _, err := fmt.Fprintf(w, "data: %s\n\n", body); err != nil {
		return false
	}

	return rc.Flush() == nil
}

// recordUsage charges the day's budget for a request. An interrupted stream may
// never deliver the usage chunk, so a character estimate stands in.
func (app *application) recordUsage(acc *openai.ChatCompletionAccumulator, req chatRequest) int64 {
	tokens := acc.Usage.TotalTokens

	if tokens == 0 {
		chars := len(systemPrompt) + len(app.context) + len(req.Message)
		for _, message := range req.History {
			chars += len(message.Content)
		}
		if len(acc.Choices) > 0 {
			chars += len(acc.Choices[0].Message.Content)
		}
		tokens = int64(chars / 4)
	}

	spent := app.budget.record(tokens)

	if app.config.dailyTokenBudget > 0 && spent >= app.config.dailyTokenBudget {
		app.logger.Printf("daily token budget reached: %d of %d", spent, app.config.dailyTokenBudget)
	}

	return tokens
}
