package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/openai/openai-go/v3"
)

const version = "1.0.0"

type config struct {
	port        int
	env         string
	contentPath string
	cors        struct {
		trustedOrigins []string
	}
}

// Origins allowed to call the API when -cors-trusted-origins is not set.
var defaultTrustedOrigins = []string{
	"http://localhost:3000",
	"https://jarylozh.github.io",
}

type application struct {
	config        config
	logger        *log.Logger
	openai_client *openai.Client
	context       string
}

func main() {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	if err := godotenv.Load(); err != nil && !os.IsNotExist(err) {
		logger.Fatalf("loading .env: %s", err)
	}

	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.contentPath, "content", "../content/portfolio.json", "Path to the portfolio content file")
	flag.Func("cors-trusted-origins", "Space separated list of trusted CORS origins", func(val string) error {
		cfg.cors.trustedOrigins = strings.Fields(val)
		return nil
	})
	flag.Parse()

	if len(cfg.cors.trustedOrigins) == 0 {
		cfg.cors.trustedOrigins = defaultTrustedOrigins
	}

	context, err := loadContext(cfg.contentPath)
	if err != nil {
		logger.Fatalf("loading portfolio content: %s", err)
	}
	logger.Printf("loaded %d characters of portfolio context", len(context))

	// initialize openai api client
	client := openai.NewClient()

	app := &application{
		config:        cfg,
		logger:        logger,
		openai_client: &client,
		context:       context,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/v1/healthcheck", app.healthcheckHandler)
	mux.HandleFunc("POST /v1/chat", app.chatHandler)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.enableCORS(mux),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Printf("starting %s server on %s", cfg.env, srv.Addr)
	logger.Fatal(srv.ListenAndServe())
}
