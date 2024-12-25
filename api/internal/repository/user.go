package repository

import (
	"context"
	"database/sql"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
)

type UserRepository interface {
	GetOrCreate(ctx context.Context, telegramID int64, username, firstName, lastName *string) (*model.User, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetOrCreate(ctx context.Context, telegramID int64, username, firstName, lastName *string) (*model.User, error) {
	// First try to get existing user
	query := `
		SELECT id, username, first_name, last_name, created_at 
		FROM users 
		WHERE id = $1
	`
	user := &model.User{ID: telegramID}
	err := r.db.QueryRowContext(ctx, query, telegramID).Scan(
		&user.ID,
		&user.Username,
		&user.FirstName,
		&user.LastName,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		// User doesn't exist, create new one
		query = `
			INSERT INTO users (id, username, first_name, last_name, created_at)
			VALUES ($1, $2, $3, $4, NOW())
			RETURNING id, username, first_name, last_name, created_at
		`
		err = r.db.QueryRowContext(ctx, query, telegramID, username, firstName, lastName).Scan(
			&user.ID,
			&user.Username,
			&user.FirstName,
			&user.LastName,
			&user.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		return user, nil
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}
