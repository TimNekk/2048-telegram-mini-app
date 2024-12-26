package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type StatsHandler struct {
	statsService service.StatsService
}

func NewStatsHandler(statsService service.StatsService) *StatsHandler {
	return &StatsHandler{
		statsService: statsService,
	}
}

// GetUserStats returns the user's game statistics
func (h *StatsHandler) GetUserStats(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)
	userID := int64(initData.User.ID)

	stats, err := h.statsService.GetUserStats(c.Request().Context(), userID)
	if err != nil {
		c.Logger().Error(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get user stats")
	}

	return c.JSON(http.StatusOK, stats)
}
