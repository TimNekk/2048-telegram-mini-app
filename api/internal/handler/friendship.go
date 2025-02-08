package handler

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"

	"gitlab.platform.corp/magnitonline/mm/backend/ci-team/2048/api/internal/service"
)

type FriendshipHandler struct {
	friendshipService service.FriendshipService
}

func NewFriendshipHandler(friendshipService service.FriendshipService) *FriendshipHandler {
	return &FriendshipHandler{
		friendshipService: friendshipService,
	}
}

type CreateFriendshipRequest struct {
	FriendID int64 `json:"friend_id"`
}

type RemoveFriendshipRequest struct {
	FriendID int64 `json:"friend_id"`
}

func (h *FriendshipHandler) CreateFriendship(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)

	var req CreateFriendshipRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	if req.FriendID == 0 {
		return echo.NewHTTPError(http.StatusBadRequest, "Friend ID is required")
	}

	friendship, err := h.friendshipService.CreateFriendship(
		c.Request().Context(),
		int64(initData.User.ID),
		req.FriendID,
	)

	if err != nil {
		switch {
		case errors.Is(err, service.ErrCannotBefriendSelf):
			return echo.NewHTTPError(http.StatusBadRequest, "Cannot be friend yourself")
		case err.Error() == "friendship already exists":
			return echo.NewHTTPError(http.StatusConflict, "Friendship already exists")
		default:
			c.Logger().Error(err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create friendship")
		}
	}

	return c.JSON(http.StatusCreated, friendship)
}

func (h *FriendshipHandler) GetFriends(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)

	friends, err := h.friendshipService.GetFriends(
		c.Request().Context(),
		int64(initData.User.ID),
	)

	if err != nil {
		c.Logger().Error(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get friends")
	}

	return c.JSON(http.StatusOK, friends)
}

func (h *FriendshipHandler) RemoveFriendship(c echo.Context) error {
	initData := c.Get("initData").(initdata.InitData)

	var req RemoveFriendshipRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	if req.FriendID == 0 {
		return echo.NewHTTPError(http.StatusBadRequest, "Friend ID is required")
	}

	err := h.friendshipService.RemoveFriendship(
		c.Request().Context(),
		int64(initData.User.ID),
		req.FriendID,
	)

	if err != nil {
		switch err {
		case service.ErrFriendshipNotFound:
			return echo.NewHTTPError(http.StatusNotFound, "Friendship not found")
		default:
			c.Logger().Error(err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to remove friendship")
		}
	}

	return c.NoContent(http.StatusNoContent)
}
