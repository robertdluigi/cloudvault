package models

import (
	"backend/pkg/db"
	"log"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User represents a user in the system with UUID as the primary key
type User struct {
	ID        string `gorm:"type:uuid;primaryKey" json:"id"`
	Username  string `gorm:"unique;not null" json:"username"`
	Email     string `gorm:"unique;not null" json:"email"`
	FirstName string `gorm:"not null" json:"first_name"`
	LastName  string `gorm:"not null" json:"last_name"`
	Password  string `json:"password"`
}

// BeforeCreate is a GORM hook to set the UUID before inserting a new record
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// Set UUID before creating the user
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}

// Create inserts a new user into the database
func (u *User) Create() error {
	// Hash the password before saving
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)

	// Use GORM to insert the user into the database
	result := db.DB.Create(u)
	return result.Error
}

// Authenticate checks the user's credentials against the database
func (u *User) Authenticate() bool {
	// Fetch the user from the database by username or email
	var storedUser User
	result := db.DB.Where("username = ? OR email = ?", u.Username, u.Email).First(&storedUser)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			log.Println("User not found:", u.Username)
		} else {
			log.Println("Error authenticating user:", result.Error)
		}
		return false
	}

	// Compare the provided password with the stored hashed password
	err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(u.Password))
	return err == nil
}
