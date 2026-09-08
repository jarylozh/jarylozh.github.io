# server

The chat backend for the portfolio site. A JSON API in Go, standard
library only apart from a `.env` loader.

Comes with a configurable HTTP server, a JSON response helper, and a
healthcheck endpoint. Everything else is yours to add.

## Run it

1. Create your local environment file:

   ```sh
   cp .env.template .env
   ```

2. Run it:

   ```sh
   go run ./cmd/api
   ```

3. Check it is alive:

   ```sh
   curl localhost:4000/v1/healthcheck
   ```

## Environment

`.env` is loaded at startup if present, and missing values are not
fatal.

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Key for embeddings and chat completions |

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `-port` | `4000` | API server port |
| `-env` | `development` | `development`, `staging`, or `production` |

## Where things go

| Path | Purpose |
| --- | --- |
| `cmd/api/main.go` | Config, logger, routes, server setup |
| `cmd/api/healthcheck.go` | Handler example and `writeJSON` helper |
| `Makefile` | Your build and run targets (empty) |

## Adding an endpoint

Write a handler on `*application` in `cmd/api`, then register it in
`main.go`:

```go
mux.HandleFunc("/v1/chat", app.chatHandler)
```

Handlers get `app.config` and `app.logger` for free. Bump `version` in
`main.go` as you release.
