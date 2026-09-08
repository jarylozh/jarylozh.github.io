package main

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

const (
	limiterSweepInterval = 3 * time.Minute
	limiterIdleTTL       = 5 * time.Minute
)

type limiterClient struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// ipLimiter holds one token bucket per client address.
type ipLimiter struct {
	mu      sync.Mutex
	clients map[string]*limiterClient
	rps     float64
	burst   int
}

func newIPLimiter(rps float64, burst int) *ipLimiter {
	limiter := &ipLimiter{
		clients: make(map[string]*limiterClient),
		rps:     rps,
		burst:   burst,
	}

	go limiter.sweep()

	return limiter
}

// allow reports whether the address has room left in its bucket.
func (l *ipLimiter) allow(ip string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	client, found := l.clients[ip]
	if !found {
		client = &limiterClient{limiter: rate.NewLimiter(rate.Limit(l.rps), l.burst)}
		l.clients[ip] = client
	}

	client.lastSeen = time.Now()

	return client.limiter.Allow()
}

// sweep drops buckets for addresses that have gone quiet, so the map does not
// grow without bound.
func (l *ipLimiter) sweep() {
	for {
		time.Sleep(limiterSweepInterval)

		l.mu.Lock()
		for ip, client := range l.clients {
			if time.Since(client.lastSeen) > limiterIdleTTL {
				delete(l.clients, ip)
			}
		}
		l.mu.Unlock()
	}
}

// rateLimit rejects requests once an address exceeds its request budget.
func (app *application) rateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if app.limiter == nil {
			next.ServeHTTP(w, r)
			return
		}

		ip := app.clientIP(r)

		if !app.limiter.allow(ip) {
			app.logger.Printf("rate limited %s", ip)
			w.Header().Set("Retry-After", "60")

			err := app.writeJSON(w, http.StatusTooManyRequests,
				chatError{Message: "too many requests, please slow down"}, nil)
			if err != nil {
				app.logger.Print(err)
			}
			return
		}

		next.ServeHTTP(w, r)
	})
}

// clientIP returns the caller address, reading the leftmost X-Forwarded-For
// entry only when -trust-proxy is set. Clients can forge that header, so it is
// off by default.
func (app *application) clientIP(r *http.Request) string {
	if app.config.trustProxy {
		if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
			first, _, _ := strings.Cut(forwarded, ",")
			if ip := strings.TrimSpace(first); ip != "" {
				return ip
			}
		}
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}

	return host
}
