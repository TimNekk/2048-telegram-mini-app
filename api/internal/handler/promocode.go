package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type PromocodeHandler struct {
	promocodeService service.PromocodeService
}

func NewPromocodeHandler(promocodeService service.PromocodeService) *PromocodeHandler {
	return &PromocodeHandler{
		promocodeService: promocodeService,
	}
}

type CreatePromocodeRequest struct {
	PromocodeTypeID int64 `json:"promocode_type_id"`
}

// GetUserPromocodes returns all promocodes for the authenticated user
func (h *PromocodeHandler) GetUserPromocodes(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)
	userID := int64(initData.User.ID)

	promocodes, err := h.promocodeService.GetUserPromocodes(c.Request().Context(), userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, promocodes)
}

// CreatePromocode creates a new promocode for the authenticated user
func (h *PromocodeHandler) CreatePromocode(c echo.Context) error {
	var req CreatePromocodeRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	initData := c.Get("initData").(initdata.InitData)
	userID := int64(initData.User.ID)

	code, err := h.promocodeService.CreatePromocode(c.Request().Context(), userID, req.PromocodeTypeID)
	if err != nil {
		switch err {
		case service.ErrPromocodeExists:
			return echo.NewHTTPError(http.StatusConflict, "You already have this type of promocode")
		case service.ErrInsufficientScore:
			return echo.NewHTTPError(http.StatusForbidden, "Your score is too low for this promocode type")
		case service.ErrPromocodeTypeNotFound:
			return echo.NewHTTPError(http.StatusNotFound, "Promocode type not found")
		default:
			c.Logger().Error(err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create promocode")
		}
	}

	return c.JSON(http.StatusCreated, map[string]string{"code": code})
}
