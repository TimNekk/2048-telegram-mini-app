package repository

import (
	"context"
	"database/sql"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
)

type PromocodeTypeRepository interface {
	GetAll(ctx context.Context) ([]model.PromocodeType, error)
	GetByID(ctx context.Context, id int64) (*model.PromocodeType, error)
}

type promocodeTypeRepository struct {
	db *sql.DB
}

func NewPromocodeTypeRepository(db *sql.DB) PromocodeTypeRepository {
	return &promocodeTypeRepository{db: db}
}

func (r *promocodeTypeRepository) GetAll(ctx context.Context) ([]model.PromocodeType, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, discount, min_order, score, type, created_at
		FROM promocode_types
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	types := make([]model.PromocodeType, 0)
	for rows.Next() {
		var t model.PromocodeType
		if err := rows.Scan(&t.ID, &t.Discount, &t.MinOrder, &t.Score, &t.Type, &t.CreatedAt); err != nil {
			return nil, err
		}
		types = append(types, t)
	}
	return types, rows.Err()
}

func (r *promocodeTypeRepository) GetByID(ctx context.Context, id int64) (*model.PromocodeType, error) {
	var t model.PromocodeType
	err := r.db.QueryRowContext(ctx, `
		SELECT id, discount, min_order, score, type, created_at
		FROM promocode_types
		WHERE id = $1
	`, id).Scan(&t.ID, &t.Discount, &t.MinOrder, &t.Score, &t.Type, &t.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &t, nil
}
