package handlers

import (
	"backend/pkg/models"
	"encoding/json"
	"net/http"
)

// AuthRequest is the structure for incoming authentication requests
type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// SignUp handles user registration
func SignUp(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Create a new user
	user := models.User{
		Username: req.Username,
		Password: req.Password,
	}

	// Call Create method from the models package
	if err := user.Create(); err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

// Login handles user authentication
func Login(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Create a user object for login
	user := models.User{
		Username: req.Username,
		Password: req.Password,
	}

	// Call Authenticate method from the models package
	if !user.Authenticate() {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Return success response
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
}
