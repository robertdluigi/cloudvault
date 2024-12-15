package migration

import (
	"backend/config"
	"backend/graph/model"
	"log"
)

func MigrateTable() {
	// Get the DB instance
	db := config.GetDB()

	// Perform migrations for the models
	if err := db.AutoMigrate(&model.User{}, &model.File{}); err != nil {
		log.Fatalf("Error migrating tables: %v", err)
	} else {
		log.Println("Database migration successful!")
	}
}
