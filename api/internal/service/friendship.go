package service

import (
	"context"
	"errors"
	"fmt"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

var (
	ErrFriendshipNotFound = errors.New("friendship not found")
	ErrCannotBefriendSelf = errors.New("cannot befriend yourself")
)

type FriendshipService interface {
	CreateFriendship(ctx context.Context, user1ID, user2ID int64) (*model.Friendship, error)
	GetFriends(ctx context.Context, userID int64) ([]*model.User, error)
	RemoveFriendship(ctx context.Context, user1ID, user2ID int64) error
}

type friendshipService struct {
	friendshipRepo repository.FriendshipRepository
	userRepo       repository.UserRepository
}

func NewFriendshipService(
	friendshipRepo repository.FriendshipRepository,
	userRepo repository.UserRepository,
) FriendshipService {
	return &friendshipService{
		friendshipRepo: friendshipRepo,
		userRepo:       userRepo,
	}
}

func (s *friendshipService) CreateFriendship(
	ctx context.Context,
	user1ID,
	user2ID int64,
) (*model.Friendship, error) {
	if user1ID == user2ID {
		return nil, ErrCannotBefriendSelf
	}

	_, err1 := s.userRepo.GetByID(ctx, user1ID)
	_, err2 := s.userRepo.GetByID(ctx, user2ID)

	if err1 != nil || err2 != nil {
		return nil, fmt.Errorf("one or both users do not exist")
	}

	friendship, err := s.friendshipRepo.CreateFriendship(ctx, user1ID, user2ID)
	if err != nil {
		if err == repository.ErrDuplicateFriendship {
			return nil, fmt.Errorf("friendship already exists")
		}
		return nil, fmt.Errorf("failed to create friendship: %w", err)
	}

	return friendship, nil
}

func (s *friendshipService) GetFriends(
	ctx context.Context,
	userID int64,
) ([]*model.User, error) {
	_, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	friends, err := s.friendshipRepo.GetFriends(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get friends: %w", err)
	}

	return friends, nil
}

func (s *friendshipService) RemoveFriendship(
	ctx context.Context,
	user1ID,
	user2ID int64,
) error {
	_, err1 := s.userRepo.GetByID(ctx, user1ID)
	_, err2 := s.userRepo.GetByID(ctx, user2ID)

	if err1 != nil || err2 != nil {
		return fmt.Errorf("one or both users do not exist")
	}

	err := s.friendshipRepo.RemoveFriendship(ctx, user1ID, user2ID)
	if err != nil {
		if err.Error() == "friendship not found" {
			return ErrFriendshipNotFound
		}
		return fmt.Errorf("failed to remove friendship: %w", err)
	}

	return nil
}
