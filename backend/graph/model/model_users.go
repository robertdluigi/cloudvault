package model

type User struct {
	ID        string  `json:"user_id" gorm:"type:varchar(255);primaryKey"`
	Password  string  `json:"password" gorm:"type:varchar(100);not null"`
	Username  string  `json:"username" gorm:"type:varchar(100);not null"`
	Email     string  `json:"email" gorm:"type:varchar(100);not null"`
	FirstName string  `json:"first_name" gorm:"type:varchar(100);not null"`
	LastName  string  `json:"last_name" gorm:"type:varchar(100);not null"`
	Files     []*File `json:"files"`
}
