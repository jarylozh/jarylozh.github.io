FROM --platform=$BUILDPLATFORM golang:1.26-alpine AS build

WORKDIR /src

COPY server/go.mod server/go.sum ./
RUN go mod download

COPY server/ ./

ARG TARGETOS=linux
ARG TARGETARCH=amd64
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH \
    go build -trimpath -ldflags="-s -w" -o /api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=build /api /api
COPY content/portfolio.json /content/portfolio.json

USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/api"]
CMD ["-content=/content/portfolio.json", "-trust-proxy", "-env=production"]
