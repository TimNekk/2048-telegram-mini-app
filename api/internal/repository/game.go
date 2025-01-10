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
	GetUserStats(ctx context.Context, userID int64) (recordScore int, totalScore int, err error)
	GetDailyRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error)
	GetTotalRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error)
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

func (r *gameRepository) GetUserStats(ctx context.Context, userID int64) (recordScore int, totalScore int, err error) {
	err = r.db.QueryRowContext(ctx, `
		SELECT 
			COALESCE(MAX(score), 0) as record_score,
			COALESCE(SUM(score), 0) as total_score
		FROM games
		WHERE user_id = $1
	`, userID).Scan(&recordScore, &totalScore)
	return
}

func (r *gameRepository) GetDailyRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error) {
	rows, err := r.db.QueryContext(ctx, `
		WITH daily_scores AS (
			SELECT
				g.user_id,
				COALESCE(MAX(g.score),
				0) AS score,
				ROW_NUMBER() OVER (
				ORDER BY COALESCE(MAX(g.score),
				0) DESC) AS POSITION
			FROM
				games g
			WHERE
				g.created_at >= NOW() - INTERVAL '24 HOURS'
			GROUP BY
				g.user_id
		)
		SELECT
            u.id,
			u.nickname,
			ds.score,
			ds.position
		FROM
			daily_scores ds
		JOIN users u ON
			u.id = ds.user_id
		WHERE
			ds.position <= $1
			OR ds.user_id = $2
	`, limit, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var places []model.RatingPlace
	for rows.Next() {
		var place model.RatingPlace
		if err := rows.Scan(&place.UserId, &place.Nickname, &place.Score, &place.Place); err != nil {
			return nil, err
		}
		places = append(places, place)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return places, nil
}

func (r *gameRepository) GetTotalRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error) {
	rows, err := r.db.QueryContext(ctx, `
		WITH overall_scores AS (
SELECT
	g.user_id,
	COALESCE(SUM(g.score),
	0) AS score,
	ROW_NUMBER() OVER (
	ORDER BY COALESCE(SUM(g.score),
	0) DESC) AS POSITION
FROM
	games g
GROUP BY
	g.user_id
)
SELECT
    u.id,
	u.nickname,
	os.score,
	os.position
FROM
	overall_scores os
JOIN users u ON
	u.id = os.user_id
WHERE
	os.position <= $1
	OR os.user_id = $2
	`, limit, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var places []model.RatingPlace
	for rows.Next() {
		var place model.RatingPlace
		if err := rows.Scan(&place.UserId, &place.Nickname, &place.Score, &place.Place); err != nil {
			return nil, err
		}
		places = append(places, place)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return places, nil
}
