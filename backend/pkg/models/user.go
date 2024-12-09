package models

import (
	"backend/pkg/db" // Import the db package for DB access
	"log"

	"golang.org/x/crypto/bcrypt"
)

// User represents a user in the system
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Create inserts a new user into the database
func (u *User) Create() error {
	// Hash the password before saving
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// SQL query to insert the user
	query := `INSERT INTO users (username, password) VALUES ($1, $2)`
	_, err = db.DB.Exec(query, u.Username, string(hashedPassword))
	return err
}

// Authenticate checks the user's credentials against the database
func (u *User) Authenticate() bool {
	// SQL query to get the hashed password from the database
	var hashedPassword string
	query := `SELECT password FROM users WHERE username = $1`
	err := db.DB.QueryRow(query, u.Username).Scan(&hashedPassword)

	if err != nil {
		log.Println("Error authenticating user:", err)
		return false
	}

	// Compare the provided password with the stored hashed password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(u.Password))
	return err == nil
}
