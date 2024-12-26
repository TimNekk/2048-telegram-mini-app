package service

import (
	"context"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

type StatsService interface {
	GetUserStats(ctx context.Context, userID int64) (*model.Stats, error)
}

type statsService struct {
	gameRepo repository.GameRepository
}

func NewStatsService(gameRepo repository.GameRepository) StatsService {
	return &statsService{
		gameRepo: gameRepo,
	}
}

func (s *statsService) GetUserStats(ctx context.Context, userID int64) (*model.Stats, error) {
	recordScore, totalScore, err := s.gameRepo.GetUserStats(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &model.Stats{
		RecordScore: recordScore,
		TotalScore:  totalScore,
	}, nil
}
