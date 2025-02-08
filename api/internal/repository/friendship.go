package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
)

var ErrDuplicateFriendship = fmt.Errorf("duplicate friendship")

type FriendshipRepository interface {
	CreateFriendship(ctx context.Context, user1ID, user2ID int64) (*model.Friendship, error)
	GetFriends(ctx context.Context, userID int64) ([]*model.User, error)
	RemoveFriendship(ctx context.Context, user1ID, user2ID int64) error
}

type friendshipRepository struct {
	db *sql.DB
}

func NewFriendshipRepository(db *sql.DB) FriendshipRepository {
	return &friendshipRepository{db: db}
}

func (r *friendshipRepository) CreateFriendship(
	ctx context.Context,
	user1ID,
	user2ID int64,
) (*model.Friendship, error) {
	query := `
		INSERT INTO friendships (user1_id, user2_id, created_at)
		VALUES ($1, $2, NOW())
		RETURNING id, user1_id, user2_id, created_at
	`

	friendship := &model.Friendship{}
	err := r.db.QueryRowContext(ctx, query, user1ID, user2ID).Scan(
		&friendship.ID,
		&friendship.User1ID,
		&friendship.User2ID,
		&friendship.CreatedAt,
	)

	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") ||
			strings.Contains(err.Error(), "duplicate key value violates unique constraint") ||
			strings.Contains(err.Error(), "Duplicate entry") {
			return nil, ErrDuplicateFriendship
		}

		return nil, fmt.Errorf("error creating friendship: %w", err)
	}

	return friendship, nil
}

func (r *friendshipRepository) GetFriends(
	ctx context.Context,
	userID int64,
) ([]*model.User, error) {
	query := `
		SELECT u.id, u.username, u.first_name, u.last_name, u.nickname, u.created_at
		FROM users u
		INNER JOIN friendships f ON (u.id = f.user2_id AND f.user1_id = $1) OR (u.id = f.user1_id AND f.user2_id = $1)
		WHERE u.id != $1 -- Exclude the user themselves
	`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("error getting friends: %w", err)
	}
	defer rows.Close()

	var friends []*model.User
	for rows.Next() {
		friend := &model.User{}
		err := rows.Scan(
			&friend.ID,
			&friend.Username,
			&friend.FirstName,
			&friend.LastName,
			&friend.Nickname,
			&friend.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning friend row: %w", err)
		}
		friends = append(friends, friend)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating friend rows: %w", err)
	}

	if len(friends) == 0 {
		return []*model.User{}, nil
	}

	return friends, nil
}

func (r *friendshipRepository) RemoveFriendship(
	ctx context.Context,
	user1ID,
	user2ID int64,
) error {
	query := `
		DELETE FROM friendships
		WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
	`

	result, err := r.db.ExecContext(ctx, query, user1ID, user2ID)
	if err != nil {
		return fmt.Errorf("error removing friendship: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("friendship not found")
	}

	return nil
}
