package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthEndpoint(t *testing.T) {
	app := &application{
		config: config{
			port: defaultPort,
		},
	}

	request := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	response := httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf(
			"expected status %d, got %d",
			http.StatusOK,
			response.Code,
		)
	}

	contentType := response.Header().Get("Content-Type")
	if contentType != "application/json" {
		t.Errorf(
			"expected Content-Type %q, got %q",
			"application/json",
			contentType,
		)
	}

	contentTypeOptions := response.Header().Get(
		"X-Content-Type-Options",
	)
	if contentTypeOptions != "nosniff" {
		t.Errorf(
			"expected X-Content-Type-Options %q, got %q",
			"nosniff",
			contentTypeOptions,
		)
	}

	expectedBody := `{"status":"ok"}`
	actualBody := response.Body.String()

	if actualBody != expectedBody {
		t.Errorf(
			"expected body %q, got %q",
			expectedBody,
			actualBody,
		)
	}
}

func TestHealthEndpointRejectsUnsupportedMethod(t *testing.T) {
	app := &application{
		config: config{
			port: defaultPort,
		},
	}

	request := httptest.NewRequest(http.MethodPost, "/api/health", nil)
	response := httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusMethodNotAllowed {
		t.Fatalf(
			"expected status %d, got %d",
			http.StatusMethodNotAllowed,
			response.Code,
		)
	}
}

func TestGetEnvironmentPortUsesDefaultPort(t *testing.T) {
	t.Setenv("PORT", "")

	port, portError := getEnvironmentPort()

	if portError != nil {
		t.Fatalf(
			"expected no error, got %v",
			portError,
		)
	}

	if port != defaultPort {
		t.Errorf(
			"expected port %d, got %d",
			defaultPort,
			port,
		)
	}
}

func TestGetEnvironmentPortUsesConfiguredPort(t *testing.T) {
	t.Setenv("PORT", "5000")

	port, portError := getEnvironmentPort()

	if portError != nil {
		t.Fatalf(
			"expected no error, got %v",
			portError,
		)
	}

	expectedPort := 5000

	if port != expectedPort {
		t.Errorf(
			"expected port %d, got %d",
			expectedPort,
			port,
		)
	}
}

func TestGetEnvironmentPortRejectsNonNumericPort(t *testing.T) {
	t.Setenv("PORT", "abc")

	_, portError := getEnvironmentPort()

	if portError == nil {
		t.Fatal("expected an error for non-numeric PORT")
	}
}

func TestGetEnvironmentPortRejectsPortBelowValidRange(t *testing.T) {
	t.Setenv("PORT", "0")

	_, portError := getEnvironmentPort()

	if portError == nil {
		t.Fatal("expected an error for PORT below valid range")
	}
}

func TestGetEnvironmentPortRejectsPortAboveValidRange(t *testing.T) {
	t.Setenv("PORT", "65536")

	_, portError := getEnvironmentPort()

	if portError == nil {
		t.Fatal("expected an error for PORT above valid range")
	}
}
