package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
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
	trustProxy  bool
	limiter     struct {
		rps     float64
		burst   int
		enabled bool
	}
	dailyTokenBudget int64
	cors             struct {
		trustedOrigins []string
	}
}

// defaultPort reads the PORT variable that hosts such as Cloud Run inject.
func defaultPort() int {
	if port, err := strconv.Atoi(os.Getenv("PORT")); err == nil {
		return port
	}
	return 4000
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
	limiter       *ipLimiter
	budget        *tokenBudget
}

func main() {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	if err := godotenv.Load(); err != nil && !os.IsNotExist(err) {
		logger.Fatalf("loading .env: %s", err)
	}

	var cfg config

	flag.IntVar(&cfg.port, "port", defaultPort(), "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.contentPath, "content", "../content/portfolio.json", "Path to the portfolio content file")
	flag.BoolVar(&cfg.trustProxy, "trust-proxy", false, "Read the client address from X-Forwarded-For")
	flag.Float64Var(&cfg.limiter.rps, "limiter-rps", 0.5, "Sustained requests per second per address")
	flag.IntVar(&cfg.limiter.burst, "limiter-burst", 5, "Burst of requests allowed per address")
	flag.BoolVar(&cfg.limiter.enabled, "limiter-enabled", true, "Enable per-address rate limiting")
	flag.Int64Var(&cfg.dailyTokenBudget, "daily-token-budget", 200000, "Token spend cap per UTC day, 0 to disable")
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
		budget:        newTokenBudget(cfg.dailyTokenBudget),
	}

	if cfg.limiter.enabled {
		app.limiter = newIPLimiter(cfg.limiter.rps, cfg.limiter.burst)
		logger.Printf("rate limiting at %.2f req/s with burst %d per address", cfg.limiter.rps, cfg.limiter.burst)
	}

	if cfg.dailyTokenBudget > 0 {
		logger.Printf("daily token budget %d", cfg.dailyTokenBudget)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/v1/healthcheck", app.healthcheckHandler)
	mux.HandleFunc("POST /v1/chat", app.chatHandler)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.enableCORS(app.rateLimit(mux)),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Printf("starting %s server on %s", cfg.env, srv.Addr)
	logger.Fatal(srv.ListenAndServe())
}
