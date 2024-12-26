package model

import (
	"time"
)

type PromocodeTypeType string

const (
	RecordPromocodeType PromocodeTypeType = "record"
	TotalPromocodeType  PromocodeTypeType = "total"
)

type PromocodeType struct {
	ID        int               `json:"id" db:"id"`
	Discount  float64           `json:"discount" db:"discount"`
	MinOrder  float64           `json:"min_order" db:"min_order"`
	Score     int               `json:"score" db:"score"`
	Type      PromocodeTypeType `json:"type" db:"type"`
	CreatedAt time.Time         `json:"created_at" db:"created_at"`
}
