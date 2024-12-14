// backend/internal/models/user.go

package models

import (
	"backend/internal/db"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User struct represents the database model for a user
type User struct {
	ID        string `gorm:"type:uuid;primaryKey" json:"user_id"`
	Username  string `gorm:"unique;not null" json:"username"`
	Email     string `gorm:"unique;not null" json:"email"`
	FirstName string `gorm:"not null" json:"first_name"`
	LastName  string `gorm:"not null" json:"last_name"`
	Password  string `json:"-"`
}

// BeforeCreate GORM hook to generate UUID before inserting the user record
func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	if user.ID == "" {
		user.ID = uuid.New().String()
	}
	return nil
}

// Create saves the user in the database with hashed password
func (user *User) Create() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	result := db.DB.Create(user)
	return result.Error
}

// Authenticate checks the user's credentials against the database
func (user *User) Authenticate() bool {
	var storedUser User
	result := db.DB.Where("email = ?", user.Email).First(&storedUser)

	if result.Error != nil {
		return false
	}

	err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
	return err == nil
}
