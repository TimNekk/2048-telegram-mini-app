package middleware

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
			// We expect passing init data in the Authorization header in the following format:
			// <auth-type> <auth-data>
			// <auth-type> must be "tma", and <auth-data> is Telegram Mini Apps init data
			authHeader := c.Request().Header.Get("Authorization")
			authParts := strings.Split(authHeader, " ")
			if len(authParts) != 2 {
				return echo.NewHTTPError(http.StatusUnauthorized, "Unauthorized")
			}

			authType := authParts[0]
			authData := authParts[1]

			switch authType {
			case "tma":
				// Validate init data. We consider init data sign valid for 24 hourы from their
				// creation moment
				if err := initdata.Validate(authData, token, 24*time.Hour); err != nil {
					return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
				}

				// Parse init data. We will surely need it in the future
				initData, err := initdata.Parse(authData)
				if err != nil {
					return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
				}

				// Store init data in context
				c.SetRequest(c.Request().WithContext(
					WithInitData(c.Request().Context(), initData),
				))
			}

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
