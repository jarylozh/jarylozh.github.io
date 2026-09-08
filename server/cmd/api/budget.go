package main

import (
	"sync"
	"time"
)

// tokenBudget caps how many tokens may be spent per UTC day. A limit of zero
// disables the cap.
type tokenBudget struct {
	mu    sync.Mutex
	limit int64
	spent int64
	day   string
}

func newTokenBudget(limit int64) *tokenBudget {
	return &tokenBudget{limit: limit, day: utcDay()}
}

// exhausted reports whether today's budget is used up.
func (b *tokenBudget) exhausted() bool {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.rollover()

	return b.limit > 0 && b.spent >= b.limit
}

// record adds tokens to today's total and returns the running total.
func (b *tokenBudget) record(tokens int64) int64 {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.rollover()
	b.spent += tokens

	return b.spent
}

// rollover resets the counter when the date changes. Callers hold the lock.
func (b *tokenBudget) rollover() {
	if today := utcDay(); today != b.day {
		b.day = today
		b.spent = 0
	}
}

func utcDay() string {
	return time.Now().UTC().Format(time.DateOnly)
}
