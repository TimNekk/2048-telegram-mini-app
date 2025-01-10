package service

import (
	"context"
	"errors"
	"regexp"
	"unicode/utf8"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

var (
	ErrInvalidNickname = errors.New("invalid nickname")
	nicknameRegex      = regexp.MustCompile(`^[a-zA-Z0-9а-яА-ЯёЁ._\- ]+$`)
)

type UserService interface {
	GetByID(ctx context.Context, id int64) (*model.User, error)
	UpdateUser(ctx context.Context, id int64, nickname *string) error
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{
		userRepo: userRepo,
	}
}

func (s *userService) GetByID(ctx context.Context, id int64) (*model.User, error) {
	return s.userRepo.GetByID(ctx, id)
}

func (s *userService) UpdateUser(ctx context.Context, id int64, nickname *string) error {
	if nickname != nil {
		if !IsValidNickname(*nickname) {
			return ErrInvalidNickname
		}
		return s.userRepo.UpdateNickname(ctx, id, *nickname)
	}
	return nil
}

func IsValidNickname(nickname string) bool {
	if utf8.RuneCountInString(nickname) < 2 {
		return false
	}

	if utf8.RuneCountInString(nickname) > 30 {
		return false
	}

	return nicknameRegex.MatchString(nickname)
}
