package model

import (
	"time"
)

type Promocode struct {
	ID              int64          `json:"id" db:"id"`
	PromocodeTypeID int            `json:"promocode_type_id" db:"promocode_type_id"`
	UserID          int64          `json:"user_id" db:"user_id"`
	Code            string         `json:"code" db:"code"`
	CreatedAt       time.Time      `json:"created_at" db:"created_at"`
	Type            *PromocodeType `json:"type,omitempty" db:"-"`
}
