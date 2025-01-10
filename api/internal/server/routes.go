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

	games := e.Group("/games")
	games.Use(customMiddleware.TelegramAuth(s.botToken))
	games.Use(customMiddleware.RequireInitData)
	games.POST("", s.gameHandler.StartGame)
	games.PATCH("/:id", s.gameHandler.PatchGame)

	promocodes := e.Group("/promocodes")
	promocodes.Use(customMiddleware.TelegramAuth(s.botToken))
	promocodes.Use(customMiddleware.RequireInitData)
	promocodes.GET("", s.promocodeHandler.GetUserPromocodes)
	promocodes.POST("", s.promocodeHandler.CreatePromocode)

	promocodeTypes := e.Group("/promocode-types")
	promocodeTypes.Use(customMiddleware.TelegramAuth(s.botToken))
	promocodeTypes.Use(customMiddleware.RequireInitData)
	promocodeTypes.GET("", s.promocodeTypeHandler.GetAll)

	// Stats routes
	stats := e.Group("/stats")
	stats.Use(customMiddleware.TelegramAuth(s.botToken))
	stats.Use(customMiddleware.RequireInitData)
	stats.GET("", s.statsHandler.GetUserStats)

	// User routes
	user := e.Group("/user")
	user.Use(customMiddleware.TelegramAuth(s.botToken))
	user.Use(customMiddleware.RequireInitData)
	user.GET("", s.userHandler.GetMe)
	user.PATCH("", s.userHandler.PatchMe)

	// Rating routes
	rating := e.Group("/rating")
	rating.Use(customMiddleware.TelegramAuth(s.botToken))
	rating.Use(customMiddleware.RequireInitData)
	rating.GET("", s.ratingHandler.GetRating)

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
