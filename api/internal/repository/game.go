package repository

import (
	"context"
	"database/sql"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
)

type GameRepository interface {
	Create(ctx context.Context, game *model.Game) error
	GetByID(ctx context.Context, id int64) (*model.Game, error)
	UpdateStatus(ctx context.Context, id int64, status model.GameStatus) error
	UpdateScore(ctx context.Context, id int64, score int) error
}

type gameRepository struct {
	db *sql.DB
}

func NewGameRepository(db *sql.DB) GameRepository {
	return &gameRepository{db: db}
}

func (r *gameRepository) Create(ctx context.Context, game *model.Game) error {
	// Start transaction
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Mark all in-progress games as skipped
	skipQuery := `
		UPDATE games 
		SET status = 'skipped'
		WHERE user_id = $1 AND status = 'in_progress'
	`
	if _, err := tx.ExecContext(ctx, skipQuery, game.UserID); err != nil {
		return err
	}

	// Create new game
	createQuery := `
		INSERT INTO games (user_id, status, score, created_at)
		VALUES ($1, $2, $3, NOW())
		RETURNING id, created_at
	`
	
	err = tx.QueryRowContext(
		ctx,
		createQuery,
		game.UserID,
		game.Status,
		game.Score,
	).Scan(&game.ID, &game.CreatedAt)
	if err != nil {
		return err
	}

	// Commit transaction
	return tx.Commit()
}

func (r *gameRepository) GetByID(ctx context.Context, id int64) (*model.Game, error) {
	query := `
		SELECT id, user_id, score, status, created_at
		FROM games
		WHERE id = $1
	`
	
	game := &model.Game{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&game.ID,
		&game.UserID,
		&game.Score,
		&game.Status,
		&game.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return game, nil
}

func (r *gameRepository) UpdateStatus(ctx context.Context, id int64, status model.GameStatus) error {
	query := `
		UPDATE games
		SET status = $1
		WHERE id = $2
	`
	
	result, err := r.db.ExecContext(ctx, query, status, id)
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

func (r *gameRepository) UpdateScore(ctx context.Context, id int64, score int) error {
	query := `
		UPDATE games
		SET score = $1
		WHERE id = $2
	`
	
	result, err := r.db.ExecContext(ctx, query, score, id)
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
