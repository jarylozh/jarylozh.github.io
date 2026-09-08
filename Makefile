.DEFAULT_GOAL := help

API_PORT ?= 4000
WEB_PORT ?= 3000
CHAT_API_URL ?= http://localhost:$(API_PORT)/v1/chat

.PHONY: help install dev dev-api dev-web build build-api build-web lint clean

help:
	@echo "install    install js and go dependencies, seed server/.env"
	@echo "dev        run the api and the site together"
	@echo "dev-api    run the go api on port $(API_PORT)"
	@echo "dev-web    run the next site on port $(WEB_PORT)"
	@echo "build      build the api binary and the static site"
	@echo "lint       run eslint and go vet"
	@echo "clean      remove build output"

install:
	pnpm install
	cd server && go mod download
	@[ -f server/.env ] || cp server/.env.template server/.env

dev:
	@echo "site $(WEB_PORT) -> http://localhost:$(WEB_PORT)"
	@echo "api  $(API_PORT) -> http://localhost:$(API_PORT)/v1/healthcheck"
	@trap 'kill 0' INT TERM EXIT; \
		$(MAKE) dev-api & \
		$(MAKE) dev-web & \
		wait

dev-api:
	cd server && go run ./cmd/api -port $(API_PORT)

dev-web:
	PORT=$(WEB_PORT) NEXT_PUBLIC_CHAT_API_URL=$(CHAT_API_URL) pnpm dev

build: build-api build-web

build-api:
	cd server && go build -o bin/api ./cmd/api

build-web:
	NEXT_PUBLIC_CHAT_API_URL=$(CHAT_API_URL) pnpm build

lint:
	pnpm lint
	cd server && go vet ./...

clean:
	rm -rf .next out server/bin
