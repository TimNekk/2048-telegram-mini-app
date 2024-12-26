package server

import (
	"fmt"
	"net/http"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/database"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/handler"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type Server struct {
	port                 int
	botToken             string
	db                   database.Service
	gameHandler          *handler.GameHandler
	promocodeHandler     *handler.PromocodeHandler
	promocodeTypeHandler *handler.PromocodeTypeHandler
	statsHandler         *handler.StatsHandler
}

func NewServer() *http.Server {
	db := database.New()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db.GetDB())
	gameRepo := repository.NewGameRepository(db.GetDB())
	promocodeRepo := repository.NewPromocodeRepository(db.GetDB())
	promocodeTypeRepo := repository.NewPromocodeTypeRepository(db.GetDB())

	// Initialize services
	gameService := service.NewGameService(userRepo, gameRepo)
	promocodeService := service.NewPromocodeService(promocodeRepo, promocodeTypeRepo, gameRepo)
	promocodeTypeService := service.NewPromocodeTypeService(promocodeTypeRepo)
	statsService := service.NewStatsService(gameRepo)

	server := &Server{
		port:                 8080,
		botToken:             os.Getenv("BOT_TOKEN"),
		db:                   db,
		gameHandler:          handler.NewGameHandler(gameService),
		promocodeHandler:     handler.NewPromocodeHandler(promocodeService),
		promocodeTypeHandler: handler.NewPromocodeTypeHandler(promocodeTypeService),
		statsHandler:         handler.NewStatsHandler(statsService),
	}

	// Declare Server config
	httpServer := &http.Server{
		Addr:         fmt.Sprintf(":%d", server.port),
		Handler:      server.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return httpServer
}
