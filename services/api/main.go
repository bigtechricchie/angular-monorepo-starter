package main

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"time"
)

const defaultPort = 4000

type config struct {
	port int
}

type application struct {
	config config
}

func main() {
	port, portError := getEnvironmentPort()
	if portError != nil {
		slog.Error(
			"failed to load API configuration",
			"error",
			portError,
		)
		os.Exit(1)
	}

	app := &application{
		config: config{
			port: port,
		},
	}

	address := fmt.Sprintf(":%d", app.config.port)

	server := &http.Server{
		Addr:              address,
		Handler:           app.routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       120 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	slog.Info(
		"API starting",
		"address",
		address,
	)

	serverError := server.ListenAndServe()
	if serverError != nil {
		slog.Error(
			"API stopped unexpectedly",
			"error",
			serverError,
		)
		os.Exit(1)
	}
}

func getEnvironmentPort() (int, error) {
	portValue := os.Getenv("PORT")

	if portValue == "" {
		return defaultPort, nil
	}

	port, conversionError := strconv.Atoi(portValue)
	if conversionError != nil {
		return 0, fmt.Errorf(
			"PORT must be an integer: %w",
			conversionError,
		)
	}

	if port < 1 || port > 65535 {
		return 0, fmt.Errorf(
			"PORT must be between 1 and 65535, got %d",
			port,
		)
	}

	return port, nil
}

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /health", app.healthHandler)

	return router
}

func (app *application) healthHandler(
	writer http.ResponseWriter,
	_ *http.Request,
) {
	writer.Header().Set("Content-Type", "application/json")
	writer.Header().Set("X-Content-Type-Options", "nosniff")
	writer.WriteHeader(http.StatusOK)

	_, writeError := io.WriteString(writer, `{"status":"ok"}`)
	if writeError != nil {
		slog.Error(
			"failed to write health response",
			"error",
			writeError,
		)
	}
}
