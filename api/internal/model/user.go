package model

import (
	"time"
)

type User struct {
	ID        int64     `json:"id" db:"id"`
	Username  *string   `json:"username,omitempty" db:"username"`
	FirstName *string   `json:"first_name,omitempty" db:"first_name"`
	LastName  *string   `json:"last_name,omitempty" db:"last_name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

func NewUser(id int64, username, firstName, lastName *string) *User {
	return &User{
		ID:        id,
		Username:  username,
		FirstName: firstName,
		LastName:  lastName,
		CreatedAt: time.Now(),
	}
}
