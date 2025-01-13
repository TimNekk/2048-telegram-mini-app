package repository

import (
	"context"
	"database/sql"
	"math/rand"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
)

type UserRepository interface {
	GetOrCreate(ctx context.Context, telegramID int64, username, firstName, lastName *string) (*model.User, error)
	GetByID(ctx context.Context, id int64) (*model.User, error)
	UpdateNickname(ctx context.Context, id int64, nickname string) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetByID(ctx context.Context, id int64) (*model.User, error) {
	query := `
		SELECT id, username, first_name, last_name, nickname, created_at 
		FROM users 
		WHERE id = $1
	`
	user := &model.User{ID: id}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Username,
		&user.FirstName,
		&user.LastName,
		&user.Nickname,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) GetOrCreate(ctx context.Context, telegramID int64, username, firstName, lastName *string) (*model.User, error) {
	user, err := r.GetByID(ctx, telegramID)

	if err == nil {
		return user, nil
	}

	query := `
			INSERT INTO users (id, username, first_name, last_name, nickname, created_at)
			VALUES ($1, $2, $3, $4, $5, NOW())
			RETURNING id, username, first_name, last_name, nickname, created_at
		`
	err = r.db.QueryRowContext(ctx, query, telegramID, username, firstName, lastName, GenerateNickname()).Scan(
		&user.ID,
		&user.Username,
		&user.FirstName,
		&user.LastName,
		&user.Nickname,
		&user.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *userRepository) UpdateNickname(ctx context.Context, id int64, nickname string) error {
	query := `
		UPDATE users
		SET nickname = $1
		WHERE id = $2
	`

	result, err := r.db.ExecContext(ctx, query, nickname, id)
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

type NicknameDictionary struct {
	Adjectives []string
	Nouns      []string
}

var nicknameDictionary = NicknameDictionary{
	Adjectives: []string{
		"Танцующий",
		"Сияющий",
		"Могучий",
		"Летающий",
		"Скользящий",
		"Смеющийся",
		"Грустный",
		"Веселый",
		"Мудрый",
		"Хитрый",
		"Быстрый",
		"Медленный",
		"Сонный",
		"Бодрый",
		"Сильный",
		"Тихий",
		"Громкий",
		"Яркий",
		"Тусклый",
		"Храбрый",
		"Забавный",
		"Умный",
		"Добрый",
		"Злой",
		"Величественный",
		"Сказочный",
		"Стремительный",
		"Мечтательный",
		"Огненный",
		"Холодный",
		"Радостный",
		"Печальный",
		"Необычный",
		"Волшебный",
		"Грозный",
		"Колючий",
		"Теплый",
	},
	Nouns: []string{
		"Кот",
		"Дракон",
		"Енот",
		"Медведь",
		"Лев",
		"Тигр",
		"Слон",
		"Волк",
		"Заяц",
		"Орёл",
		"Сокол",
		"Пингвин",
		"Краб",
		"Кит",
		"Дельфин",
		"Попугай",
		"Ёжик",
		"Филин",
		"Суслик",
		"Барсук",
		"Павлин",
		"Жираф",
		"Крокодил",
		"Верблюд",
		"Муравей",
	},
}

func GenerateNickname() string {
	randomAdjective := nicknameDictionary.Adjectives[rand.Intn(len(nicknameDictionary.Adjectives))]
	randomNoun := nicknameDictionary.Nouns[rand.Intn(len(nicknameDictionary.Nouns))]

	return randomAdjective + " " + randomNoun
}
