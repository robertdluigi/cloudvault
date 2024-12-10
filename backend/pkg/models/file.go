package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// File represents a file record in the system
type File struct {
	ID        string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"not null" json:"user_id"`   // Foreign key to the User model
	FileName  string    `gorm:"not null" json:"file_name"` // The name of the file
	FileSize  int       `json:"file_size"`                 // The size of the file
	CreatedAt time.Time `json:"created_at"`                // Timestamp of when the file was uploaded

	User User `gorm:"foreignKey:UserID" json:"user"` // GORM association to the User model
}

// BeforeCreate is a GORM hook to set the UUID before inserting a new record
func (f *File) BeforeCreate(tx *gorm.DB) (err error) {
	if f.ID == "" {
		f.ID = uuid.New().String()
	}
	return nil
}
