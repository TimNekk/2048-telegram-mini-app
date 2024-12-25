package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/database"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/handler"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

type Server struct {
	port        int
	botToken    string
	db          database.Service
	gameHandler *handler.GameHandler
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	db := database.New()
	
	// Initialize repositories
	userRepo := repository.NewUserRepository(db.GetDB())
	gameRepo := repository.NewGameRepository(db.GetDB())
	
	server := &Server{
		port:        port,
		botToken:    os.Getenv("BOT_TOKEN"),
		db:          db,
		gameHandler: handler.NewGameHandler(userRepo, gameRepo),
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
