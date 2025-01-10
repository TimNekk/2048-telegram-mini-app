package model

type RatingPlace struct {
	UserId   int64   `json:"user_id"`
	Nickname *string `json:"user_nickname"`
	Score    int     `json:"score"`
	Place    int     `json:"place"`
}
