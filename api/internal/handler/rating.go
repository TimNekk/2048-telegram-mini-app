package handler

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type RatingHandler struct {
	ratingService service.RatingService
}

func NewRatingHandler(ratingService service.RatingService) *RatingHandler {
	return &RatingHandler{
		ratingService: ratingService,
	}
}

func (h *RatingHandler) GetRating(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)
	userID := int64(initData.User.ID)

	// QueryParam: limit, default: 3
	limit := c.QueryParam("limit")
	if limit == "" {
		limit = "3"
	}
	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid limit")
	}

	ratingType := c.QueryParam("type")

	if ratingType == "daily" {
		rating, err := h.ratingService.GetDailyRating(c.Request().Context(), limitInt, userID)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, rating)
	} else if ratingType == "total" {
		rating, err := h.ratingService.GetTotalRating(c.Request().Context(), limitInt, userID)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.JSON(http.StatusOK, rating)
	} else {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid rating type")
	}
}
