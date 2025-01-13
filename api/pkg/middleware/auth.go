package middleware

import "fmt"

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	initdata "github.com/telegram-mini-apps/init-data-golang"
)

type contextKey string

const (
	_initDataKey contextKey = "init-data"
)

// WithInitData returns new context with specified init data
func WithInitData(ctx context.Context, initData initdata.InitData) context.Context {
	return context.WithValue(ctx, _initDataKey, initData)
}

// GetInitData returns the init data from the specified context
func GetInitData(ctx context.Context) (initdata.InitData, bool) {
	initData, ok := ctx.Value(_initDataKey).(initdata.InitData)
	return initData, ok
}

// TelegramAuth middleware authenticates Telegram Mini Apps requests
func TelegramAuth(token string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			authParts := strings.Split(authHeader, " ")
			if len(authParts) != 2 {
				return echo.NewHTTPError(http.StatusUnauthorized, "Invalid authorization header")
			}

			authType := authParts[0]
			authData := authParts[1]

			if authType != "tma" {
				return echo.NewHTTPError(http.StatusUnauthorized, "Invalid authorization type")
			}

			// First parse the data
			initData, err := initdata.Parse(authData)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, "Invalid init data format")
			}

			// Then validate it
			if err := initdata.Validate(authData, token, 48*time.Hour); err != nil {
				c.Logger().Warn("Auth validation failed for date: ", initData.AuthDateRaw)
				return echo.NewHTTPError(http.StatusUnauthorized, "Invalid init data signature, authDate: "+fmt.Sprint(initData.AuthDateRaw))
			}

			// Store validated init data in context
			c.SetRequest(c.Request().WithContext(
				WithInitData(c.Request().Context(), initData),
			))

			return next(c)
		}
	}
}

// RequireInitData middleware ensures init data is present in the context
func RequireInitData(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		initData, ok := GetInitData(c.Request().Context())
		if !ok {
			return echo.NewHTTPError(http.StatusUnauthorized, "Init data not found")
		}

		// Store init data in echo context for easy access
		c.Set("initData", initData)
		return next(c)
	}
}
