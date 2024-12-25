FROM golang:1.23.3 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/healthcheck ./cmd/healthcheck
RUN CGO_ENABLED=0 GOOS=linux go build -o /healthcheck ./cmd/healthcheck

COPY cmd/ ./cmd
COPY pkg/ ./pkg
COPY internal/ ./internal

RUN CGO_ENABLED=0 GOOS=linux go build -o /api ./cmd/api

FROM gcr.io/distroless/base-debian11

WORKDIR /

COPY --from=builder /healthcheck /healthcheck
COPY --from=builder /api /api

USER nonroot:nonroot

ENTRYPOINT ["/api"]

HEALTHCHECK --interval=10s --timeout=10s --start-period=5s --retries=3 \
    CMD ["/healthcheck"]