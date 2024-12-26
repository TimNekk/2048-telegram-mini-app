package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type PromocodeTypeHandler struct {
	promocodeTypeService service.PromocodeTypeService
}

func NewPromocodeTypeHandler(promocodeTypeService service.PromocodeTypeService) *PromocodeTypeHandler {
	return &PromocodeTypeHandler{
		promocodeTypeService: promocodeTypeService,
	}
}

// GetAll returns all available promocode types
func (h *PromocodeTypeHandler) GetAll(c echo.Context) error {
	types, err := h.promocodeTypeService.GetAll(c.Request().Context())
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, types)
}
