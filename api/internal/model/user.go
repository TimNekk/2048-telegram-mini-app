package model

import (
	"time"
)

type User struct {
	ID        int64     `json:"id" db:"id"`
	Username  *string   `json:"username" db:"username"`
	FirstName *string   `json:"first_name" db:"first_name"`
	LastName  *string   `json:"last_name" db:"last_name"`
	Nickname  *string   `json:"nickname" db:"nickname"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

func NewUser(id int64, username, firstName, lastName, nickname *string) *User {
	return &User{
		ID:        id,
		Username:  username,
		FirstName: firstName,
		LastName:  lastName,
		Nickname:  nickname,
		CreatedAt: time.Now(),
	}
}
