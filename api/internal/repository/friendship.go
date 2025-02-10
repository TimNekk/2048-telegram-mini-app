package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"
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
	if user1ID > user2ID {
		user1ID, user2ID = user2ID, user1ID
	}

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
        FROM friendships f
        INNER JOIN users u ON u.id = CASE
            WHEN f.user1_id = $1 THEN f.user2_id
            ELSE f.user1_id
        END
        WHERE $1 IN (f.user1_id, f.user2_id)
    `

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("error getting friends: %w", err)
	}
	defer rows.Close()

	var friends []*model.User = []*model.User{}
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

	return friends, nil
}

func (r *friendshipRepository) RemoveFriendship(
	ctx context.Context,
	user1ID,
	user2ID int64,
) error {
	if user1ID > user2ID {
		user1ID, user2ID = user2ID, user1ID
	}

	query := `
        DELETE FROM friendships
        WHERE user1_id = $1 AND user2_id = $2
    `

	_, err := r.db.ExecContext(ctx, query, user1ID, user2ID)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("error removing friendship: %w", err)
	}

	return nil
}
