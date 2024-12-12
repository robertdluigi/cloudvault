package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// File represents a file record in the system
type FileModel struct {
	ID        string     `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    string     `gorm:"not null" json:"user_id"` // Foreign key to the User model
	AccessKey string     `json:"access_key"`
	FileType  string     `gorm:"not null" json:"file_type"`     // The type of the file
	FileURL   string     `gorm:"not null" json:"file_url"`      // The URL of the file
	FileName  string     `gorm:"not null" json:"file_name"`     // The name of the file
	FileSize  int        `json:"file_size"`                     // The size of the file
	CreatedAt time.Time  `json:"created_at"`                    // Timestamp of when the file was uploaded
	UpdatedAt time.Time  `json:"updated_at"`                    // Timestamp of when the file was last updated
	User      UserEntity `gorm:"foreignkey:UserID" json:"user"` // The user who uploaded the file
}

// BeforeCreate is a GORM hook to set the UUID before inserting a new record
func (entity *FileModel) BeforeCreate(tx *gorm.DB) (err error) {
	if entity.ID == "" {
		entity.ID = uuid.New().String()
	}
	entity.CreatedAt = time.Now().Local()
	entity.UpdatedAt = time.Now().Local()

	return nil
}
