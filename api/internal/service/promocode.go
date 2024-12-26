package service

import (
	"context"
	"errors"
	"math/rand"
	"strings"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

var (
	ErrPromocodeExists        = errors.New("promocode already exists for this type")
	ErrInsufficientScore     = errors.New("insufficient score for this promocode type")
	ErrPromocodeTypeNotFound = errors.New("promocode type not found")
)

type PromocodeService interface {
	GetUserPromocodes(ctx context.Context, userID int64) ([]model.Promocode, error)
	CreatePromocode(ctx context.Context, userID int64, promocodeTypeID int64) (string, error)
}

type promocodeService struct {
	promocodeRepo     repository.PromocodeRepository
	promocodeTypeRepo repository.PromocodeTypeRepository
	gameRepo         repository.GameRepository
}

func NewPromocodeService(
	promocodeRepo repository.PromocodeRepository,
	promocodeTypeRepo repository.PromocodeTypeRepository,
	gameRepo repository.GameRepository,
) PromocodeService {
	return &promocodeService{
		promocodeRepo:     promocodeRepo,
		promocodeTypeRepo: promocodeTypeRepo,
		gameRepo:         gameRepo,
	}
}

func (s *promocodeService) GetUserPromocodes(ctx context.Context, userID int64) ([]model.Promocode, error) {
	return s.promocodeRepo.GetUserPromocodes(ctx, userID)
}

func generateRandomCode(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]string, length)
	for i := 0; i < length; i++ {
		result[i] = string(charset[rand.Intn(len(charset))])
	}
	return strings.Join(result, "")
}

func (s *promocodeService) CreatePromocode(ctx context.Context, userID int64, promocodeTypeID int64) (string, error) {
	// Check if promocode type exists and get its requirements
	promocodeType, err := s.promocodeTypeRepo.GetByID(ctx, promocodeTypeID)
	if err != nil {
		return "", ErrPromocodeTypeNotFound
	}

	// Check if user already has this type of promocode
	userPromocodes, err := s.promocodeRepo.GetUserPromocodes(ctx, userID)
	if err != nil {
		return "", err
	}
	for _, p := range userPromocodes {
		if p.PromocodeTypeID == int(promocodeTypeID) {
			return "", ErrPromocodeExists
		}
	}

	// Get user's stats
	recordScore, totalScore, err := s.gameRepo.GetUserStats(ctx, userID)
	if err != nil {
		return "", err
	}

	// Check if user meets the score requirement
	switch promocodeType.Type {
	case model.RecordPromocodeType:
		if recordScore < promocodeType.Score {
			return "", ErrInsufficientScore
		}
	case model.TotalPromocodeType:
		if totalScore < promocodeType.Score {
			return "", ErrInsufficientScore
		}
	}

	// Generate and create promocode
	code := generateRandomCode(12)
	err = s.promocodeRepo.CreatePromocode(ctx, userID, promocodeTypeID, code)
	if err != nil {
		return "", err
	}

	return code, nil
}
