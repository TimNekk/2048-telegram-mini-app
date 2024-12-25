package model

import (
	"time"
)

type GameStatus string

const (
	GameStatusInProgress GameStatus = "in_progress"
	GameStatusFinished   GameStatus = "finished"
	GameStatusSkipped    GameStatus = "skipped"
)

type Game struct {
	ID        int64      `json:"id" db:"id"`
	UserID    int64      `json:"user_id" db:"user_id"`
	Score     int        `json:"score" db:"score"`
	Status    GameStatus `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
}

func NewGame(userID int64) *Game {
	return &Game{
		UserID:    userID,
		Score:     0,
		Status:    GameStatusInProgress,
		CreatedAt: time.Now(),
	}
}
