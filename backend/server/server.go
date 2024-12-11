package server

import (
	// Import the auth package for the Validate function
	"backend/pkg/auth"
	"backend/pkg/db"       // Import the db package
	"backend/pkg/handlers" // Import the handlers package
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Start initializes the server and routes
func Start() {
	// Initialize the database connection
	db.InitDB() // Move the DB initialization here from server.go

	router := mux.NewRouter()

	// Routes
	router.HandleFunc("/api/v1/auth/signup", handlers.SignUp).Methods("POST")
	router.HandleFunc("/api/v1/auth/login", handlers.Login).Methods("POST")
	router.HandleFunc("/api/v1/auth/validate", auth.Validate).Methods("GET") // Add the validate route

	// Configure CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000", // Your frontend URL (add more if needed)
		},
		AllowedMethods: []string{
			"GET", "POST", "PUT", "DELETE",
		},
		AllowedHeaders: []string{
			"Content-Type", "Authorization",
		},
		AllowCredentials: true,
	})

	// Wrap the router with CORS
	handler := c.Handler(router)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
