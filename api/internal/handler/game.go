package handler

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/repository"
)

type GameHandler struct {
	userRepo repository.UserRepository
	gameRepo repository.GameRepository
}

type StartGameResponse struct {
	Game *model.Game `json:"game"`
}

type PatchGameRequest struct {
	Score  *int              `json:"score,omitempty"`
	Status *model.GameStatus `json:"status,omitempty"`
}

func NewGameHandler(userRepo repository.UserRepository, gameRepo repository.GameRepository) *GameHandler {
	return &GameHandler{
		userRepo: userRepo,
		gameRepo: gameRepo,
	}
}

func (h *GameHandler) StartGame(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)

	// Get or create user based on Telegram data
	user, err := h.userRepo.GetOrCreate(
		c.Request().Context(),
		int64(initData.User.ID),
		&initData.User.Username,
		&initData.User.FirstName,
		&initData.User.LastName,
	)
	if err != nil {
		c.Logger().Error(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to process user data")
	}

	// Create new game
	game := model.NewGame(user.ID)

	// Save game to database
	if err := h.gameRepo.Create(c.Request().Context(), game); err != nil {
		c.Logger().Error(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create game")
	}

	return c.JSON(http.StatusCreated, StartGameResponse{
		Game: game,
	})
}

func (h *GameHandler) PatchGame(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)
	gameID := c.Param("id")

	if gameID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Game ID is required")
	}

	// Parse game ID
	id, err := strconv.ParseInt(gameID, 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid game ID")
	}

	// Get game from database
	game, err := h.gameRepo.GetByID(c.Request().Context(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Game not found")
		}
		c.Logger().Error(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get game")
	}

	// Verify user owns this game
	if game.UserID != int64(initData.User.ID) {
		return echo.NewHTTPError(http.StatusForbidden, "You don't have permission to modify this game")
	}

	// Parse request body
	var req PatchGameRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	// Update game fields if provided
	if req.Score != nil {
		if err := h.gameRepo.UpdateScore(c.Request().Context(), id, *req.Score); err != nil {
			c.Logger().Error(err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update game score")
		}
		game.Score = *req.Score
	}

	if req.Status != nil {
		if err := h.gameRepo.UpdateStatus(c.Request().Context(), id, *req.Status); err != nil {
			c.Logger().Error(err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update game status")
		}
		game.Status = *req.Status
	}

	return c.JSON(http.StatusOK, StartGameResponse{
		Game: game,
	})
}
