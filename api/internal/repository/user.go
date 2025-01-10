package repository

import (
	"context"
	"database/sql"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
)

type UserRepository interface {
	GetOrCreate(ctx context.Context, telegramID int64, username, firstName, lastName *string) (*model.User, error)
	GetByID(ctx context.Context, id int64) (*model.User, error)
	UpdateNickname(ctx context.Context, id int64, nickname string) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetByID(ctx context.Context, id int64) (*model.User, error) {
	query := `
		SELECT id, username, first_name, last_name, nickname, created_at 
		FROM users 
		WHERE id = $1
	`
	user := &model.User{ID: id}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Username,
		&user.FirstName,
		&user.LastName,
		&user.Nickname,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) GetOrCreate(ctx context.Context, telegramID int64, username, firstName, lastName *string) (*model.User, error) {
	user, err := r.GetByID(ctx, telegramID)

	if err == nil {
		return user, nil
	}

	query := `
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

func (r *userRepository) UpdateNickname(ctx context.Context, id int64, nickname string) error {
	query := `
		UPDATE users
		SET nickname = $1
		WHERE id = $2
	`

	result, err := r.db.ExecContext(ctx, query, nickname, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}
