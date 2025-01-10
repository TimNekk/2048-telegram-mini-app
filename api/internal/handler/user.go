package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"
	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type UserHandler struct {
	userService service.UserService
}

type PatchMeRequest struct {
	Nickname *string `json:"nickname,omitempty"`
}

func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (h *UserHandler) GetMe(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)
	user, err := h.userService.GetByID(c.Request().Context(), initData.User.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, user)
}

func (h *UserHandler) PatchMe(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)
	var req PatchMeRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := h.userService.UpdateUser(c.Request().Context(), initData.User.ID, req.Nickname); err != nil {
		switch err {
		case service.ErrInvalidNickname:
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid nickname")
		default:
			c.Logger().Error(err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update user")
		}
	}

	user, err := h.userService.GetByID(c.Request().Context(), initData.User.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, user)
}
