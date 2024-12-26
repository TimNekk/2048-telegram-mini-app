package repository

import (
	"context"
	"database/sql"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
)

type PromocodeRepository interface {
	GetUserPromocodes(ctx context.Context, userID int64) ([]model.Promocode, error)
	CreatePromocode(ctx context.Context, userID int64, promocodeTypeID int64, code string) error
}

type promocodeRepository struct {
	db *sql.DB
}

func NewPromocodeRepository(db *sql.DB) PromocodeRepository {
	return &promocodeRepository{db: db}
}

func (r *promocodeRepository) GetUserPromocodes(ctx context.Context, userID int64) ([]model.Promocode, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT p.id, p.promocode_type_id, p.user_id, p.code, p.created_at,
			   pt.id, pt.discount, pt.min_order, pt.score, pt.type, pt.created_at
		FROM promocodes p
		JOIN promocode_types pt ON p.promocode_type_id = pt.id
		WHERE p.user_id = $1
		ORDER BY p.created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	promocodes := make([]model.Promocode, 0)
	for rows.Next() {
		var p model.Promocode
		p.Type = &model.PromocodeType{}
		if err := rows.Scan(
			&p.ID, &p.PromocodeTypeID, &p.UserID, &p.Code, &p.CreatedAt,
			&p.Type.ID, &p.Type.Discount, &p.Type.MinOrder, &p.Type.Score, &p.Type.Type, &p.Type.CreatedAt,
		); err != nil {
			return nil, err
		}
		promocodes = append(promocodes, p)
	}
	return promocodes, rows.Err()
}

func (r *promocodeRepository) CreatePromocode(ctx context.Context, userID int64, promocodeTypeID int64, code string) error {
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO promocodes (promocode_type_id, user_id, code)
		VALUES ($1, $2, $3)
		RETURNING id
	`, promocodeTypeID, userID, code)
	return err
}
