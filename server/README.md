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

## Flags added for the chat endpoint

| Flag | Default | Description |
| --- | --- | --- |
| `-content` | `../content/portfolio.json` | Portfolio data read at startup |
| `-cors-trusted-origins` | localhost:3000, jarylozh.github.io | Space separated allowed origins |
| `-trust-proxy` | `false` | Read the client address from `X-Forwarded-For` |
| `-limiter-rps` | `0.5` | Sustained requests per second per address |
| `-limiter-burst` | `5` | Burst of requests allowed per address |
| `-limiter-enabled` | `true` | Enable per-address rate limiting |
| `-daily-token-budget` | `200000` | Token spend cap per UTC day, `0` disables |

`-port` defaults to the `PORT` variable when the host sets one, otherwise
`4000`.

## Deploy to Cloud Run

Pushes to `main` that touch `server/` or `content/` build and deploy the
service automatically via `.github/workflows/backend.yml`, which
authenticates to Google Cloud with Workload Identity Federation. The steps
below are the manual equivalent.


The image must be `linux/amd64`; Cloud Run rejects arm64. `make image`
cross-compiles from the repo root, where the build context can reach both
`server/` and `content/`.

Pick one of the free tier regions — `us-central1`, `us-east1`, or
`us-west1` — or the allowance does not apply.

1. Store the API key:

   ```sh
   printf '%s' "$OPENAI_API_KEY" | \
     gcloud secrets create openai-api-key --data-file=-
   ```

2. Build and push:

   ```sh
   make image IMAGE=us-central1-docker.pkg.dev/PROJECT/portfolio/api
   podman push us-central1-docker.pkg.dev/PROJECT/portfolio/api
   ```

3. Deploy:

   ```sh
   gcloud run deploy portfolio-api \
     --image us-central1-docker.pkg.dev/PROJECT/portfolio/api \
     --region us-central1 \
     --allow-unauthenticated \
     --min-instances 0 \
     --set-secrets OPENAI_API_KEY=openai-api-key:latest
   ```

`--min-instances 0` keeps the service inside the free tier; anything higher
bills continuously. The container already passes `-trust-proxy` and
`-env=production`.

4. Confirm the response actually streams, rather than arriving in one piece:

   ```sh
   curl -N -X POST https://SERVICE-URL/v1/chat \
     -H 'Content-Type: application/json' \
     -d '{"message":"what have you worked on?","history":[]}'
   ```
