package main

import (
	"fmt"
	"log"
	"os"

	"backend/pkg/models" // Import the models package where User and File are defined

	"github.com/joho/godotenv" // godotenv package for loading environment variables
	"gorm.io/driver/postgres"  // PostgreSQL GORM driver
	"gorm.io/gorm"             // GORM ORM
)

// Initialize the database connection
func initDB() (*gorm.DB, error) {
	// Load environment variables from the .env file
	if err := godotenv.Load(); err != nil {
		return nil, fmt.Errorf("error loading .env file: %v", err)
	}

	// Get the DATABASE_URL from the environment variables
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set in .env")
	}

	// Open a new connection to the database using GORM
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	return db, nil
}

// Migrate models to create tables in the database
func migrate(db *gorm.DB) error {
	// Automatically create tables based on the models
	err := db.AutoMigrate(&models.UserEntity{}, &models.FileModel{})
	if err != nil {
		return fmt.Errorf("failed to auto migrate models: %v", err)
	}

	log.Println("Tables created successfully!")
	return nil
}

func main() {
	// Initialize database connection
	db, err := initDB()
	if err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}

	// Migrate the models to the database
	err = migrate(db)
	if err != nil {
		log.Fatalf("Error migrating tables: %v", err)
	}
}
