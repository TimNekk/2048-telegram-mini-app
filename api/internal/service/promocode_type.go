package service

import (
	"context"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

type PromocodeTypeService interface {
	GetAll(ctx context.Context) ([]model.PromocodeType, error)
}

type promocodeTypeService struct {
	promocodeTypeRepo repository.PromocodeTypeRepository
}

func NewPromocodeTypeService(promocodeTypeRepo repository.PromocodeTypeRepository) PromocodeTypeService {
	return &promocodeTypeService{
		promocodeTypeRepo: promocodeTypeRepo,
	}
}

func (s *promocodeTypeService) GetAll(ctx context.Context) ([]model.PromocodeType, error) {
	return s.promocodeTypeRepo.GetAll(ctx)
}
