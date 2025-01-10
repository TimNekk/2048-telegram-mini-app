package service

import (
	"context"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

type RatingService interface {
	GetDailyRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error)
	GetTotalRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error)
}

type ratingService struct {
	gameRepo repository.GameRepository
}

func NewRatingService(gameRepo repository.GameRepository) RatingService {
	return &ratingService{
		gameRepo: gameRepo,
	}
}

func (s *ratingService) GetDailyRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error) {
	return s.gameRepo.GetDailyRating(ctx, limit, userID)
}

func (s *ratingService) GetTotalRating(ctx context.Context, limit int, userID int64) ([]model.RatingPlace, error) {
	return s.gameRepo.GetTotalRating(ctx, limit, userID)
}
