package server

import (
	"backend/pkg/db"       // Import the db package
	"backend/pkg/handlers" // Import the handlers package
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Start initializes the server and routes
func Start() {
	// Initialize the database connection
	db.InitDB() // Move the DB initialization here from server.go

	router := mux.NewRouter()

	// Routes
	router.HandleFunc("/signup", handlers.SignUp).Methods("POST")
	router.HandleFunc("/login", handlers.Login).Methods("POST")

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
