package server

import (
	"log"
	"net/http"

	"backend/pkg/auth"
	"backend/pkg/db"
	"backend/pkg/handlers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Start initializes the server and routes
func Start() {
	// Initialize the database
	db.InitDB()

	// Create a new router
	router := mux.NewRouter()

	// API Routes
	router.HandleFunc("/api/v1/auth/signup", handlers.SignUp).Methods(http.MethodPost)
	router.HandleFunc("/api/v1/auth/login", handlers.Login).Methods(http.MethodPost)
	router.HandleFunc("/api/v1/auth/validate", auth.Validate).Methods(http.MethodGet)
	router.HandleFunc("/api/v1/files/upload", handlers.UploadFile).Methods(http.MethodPost)
	router.HandleFunc("/api/v1/files/{userID}", handlers.GetFilesByUserID).Methods(http.MethodGet)

	// Configure CORS
	corsConfig := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := corsConfig.Handler(router)

	log.Println("Server is running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
