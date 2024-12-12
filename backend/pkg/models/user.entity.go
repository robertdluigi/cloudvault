package models

import (
	"backend/pkg/db"
	"log"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User represents a user in the system with UUID as the primary key
type UserEntity struct {
	ID        string `gorm:"type:uuid;primaryKey" json:"user_id"`
	Username  string `gorm:"unique;not null" json:"username"`
	Email     string `gorm:"unique;not null" json:"email"`
	FirstName string `gorm:"not null" json:"first_name"`
	LastName  string `gorm:"not null" json:"last_name"`
	Image     string `json:"image"`
	Password  string `json:"password"`
}

// BeforeCreate is a GORM hook to set the UUID before inserting a new record
func (entity *UserEntity) BeforeCreate(tx *gorm.DB) (err error) {
	// Set UUID before creating the user
	if entity.ID == "" {
		entity.ID = uuid.New().String()
	}
	return nil
}

// Create inserts a new user into the database
func (entity *UserEntity) Create() error {
	// Hash the password before saving
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(entity.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	entity.Password = string(hashedPassword)

	// Use GORM to insert the user into the database
	result := db.DB.Create(entity)
	return result.Error
}

// Authenticate checks the user's credentials against the database
func (entity *UserEntity) Authenticate() bool {
	// Fetch the user from the database by username or email
	var storedUser UserEntity
	result := db.DB.Where("username = ? OR email = ?", entity.Username, entity.Email).First(&storedUser)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			log.Println("User not found:", entity.Username)
		} else {
			log.Println("Error authenticating user:", result.Error)
		}
		return false
	}

	// Compare the provided password with the stored hashed password
	err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(entity.Password))
	return err == nil
}

// GetProfileByEmail function to get profile by email
func GetProfileByEmail(email string) (UserEntity, error) {
	var user UserEntity
	result := db.DB.Where("email = ?", email).First(&user)
	return user, result.Error
}
