package service

import (
	"context"
	"database/sql"
	"errors"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

var (
	ErrGameNotFound      = errors.New("game not found")
	ErrGameAccessDenied  = errors.New("access denied to game")
	ErrInvalidGameID     = errors.New("invalid game id")
)

type GameService interface {
	StartGame(ctx context.Context, userID int64, username, firstName, lastName *string) (*model.Game, error)
	UpdateGame(ctx context.Context, gameID int64, userID int64, score *int, status *model.GameStatus) (*model.Game, error)
}

type gameService struct {
	userRepo repository.UserRepository
	gameRepo repository.GameRepository
}

func NewGameService(userRepo repository.UserRepository, gameRepo repository.GameRepository) GameService {
	return &gameService{
		userRepo: userRepo,
		gameRepo: gameRepo,
	}
}

func (s *gameService) StartGame(ctx context.Context, userID int64, username, firstName, lastName *string) (*model.Game, error) {
	// Get or create user based on Telegram data
	user, err := s.userRepo.GetOrCreate(ctx, userID, username, firstName, lastName)
	if err != nil {
		return nil, err
	}

	// Create new game
	game := model.NewGame(user.ID)

	// Save game to database
	if err := s.gameRepo.Create(ctx, game); err != nil {
		return nil, err
	}

	return game, nil
}

func (s *gameService) UpdateGame(ctx context.Context, gameID int64, userID int64, score *int, status *model.GameStatus) (*model.Game, error) {
	// Get game from database
	game, err := s.gameRepo.GetByID(ctx, gameID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrGameNotFound
		}
		return nil, err
	}

	// Verify user owns this game
	if game.UserID != userID {
		return nil, ErrGameAccessDenied
	}

	// Update game fields if provided
	if score != nil {
		if err := s.gameRepo.UpdateScore(ctx, gameID, *score); err != nil {
			return nil, err
		}
		game.Score = *score
	}

	if status != nil {
		if err := s.gameRepo.UpdateStatus(ctx, gameID, *status); err != nil {
			return nil, err
		}
		game.Status = *status
	}

	return game, nil
}
