package model

import (
	"time"
)

type File struct {
	ID        string    `gorm:"primaryKey;type:uuid;" json:"id" graphql:"id"`
	Filename  string    `gorm:"type:varchar(255);not null" json:"filename" graphql:"filename"`
	Mimetype  string    `gorm:"type:varchar(100)" json:"mimetype" graphql:"mimetype"`
	Encoding  string    `gorm:"type:varchar(100)" json:"encoding" graphql:"encoding"`
	Filesize  int       `gorm:"type:int" json:"filesize" graphql:"filesize"`
	URL       string    `gorm:"type:text;not null" json:"url" graphql:"url"`
	UserID    string    `gorm:"type:varchar(255);not null" json:"user_id" graphql:"user_id"`
	User      User      `gorm:"foreignKey:UserID;references:ID" json:"user" graphql:"user"`
	CreatedAt time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"createdAt" graphql:"createdAt"`
}
