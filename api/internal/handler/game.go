package handler

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/model"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type GameHandler struct {
	gameService service.GameService
}

type StartGameResponse struct {
	Game *model.Game `json:"game"`
}

type PatchGameRequest struct {
	Score  *int              `json:"score,omitempty"`
	Status *model.GameStatus `json:"status,omitempty"`
}

func NewGameHandler(gameService service.GameService) *GameHandler {
	return &GameHandler{
		gameService: gameService,
	}
}

func (h *GameHandler) StartGame(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)

	game, err := h.gameService.StartGame(
		c.Request().Context(),
		int64(initData.User.ID),
		&initData.User.Username,
		&initData.User.FirstName,
		&initData.User.LastName,
	)
	if err != nil {
		c.Logger().Error(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to start game")
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

	// Parse request body
	var req PatchGameRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	game, err := h.gameService.UpdateGame(
		c.Request().Context(),
		id,
		int64(initData.User.ID),
		req.Score,
		req.Status,
	)
	if err != nil {
		switch err {
		case service.ErrGameNotFound:
			return echo.NewHTTPError(http.StatusNotFound, "Game not found")
		case service.ErrGameAccessDenied:
			return echo.NewHTTPError(http.StatusForbidden, "You don't have permission to modify this game")
		default:
			c.Logger().Error(err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update game")
		}
	}

	return c.JSON(http.StatusOK, StartGameResponse{
		Game: game,
	})
}
