package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	customMiddleware "gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/pkg/middleware"
)

// RegisterRoutes sets up all the routes for the server
func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.GET("/", s.HelloWorldHandler)
	e.GET("/health", s.healthHandler)

	// Game routes with Telegram authentication
	games := e.Group("/games")
	games.Use(customMiddleware.TelegramAuth(s.botToken))
	games.Use(customMiddleware.RequireInitData)
	games.POST("", s.gameHandler.StartGame)
	games.PATCH("/:id", s.gameHandler.PatchGame)

	return e
}

// HelloWorldHandler handles the root endpoint
func (s *Server) HelloWorldHandler(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

// healthHandler handles the health check endpoint
func (s *Server) healthHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"status": "ok",
	})
}
