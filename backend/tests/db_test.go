package tests

import (
	"os"
	"testing"

	"backend/internal/db"

	"github.com/joho/godotenv"
)

func TestDatabaseConnection(t *testing.T) {
	// Load .env file from the parent directory
	err := godotenv.Load("../.env")
	if err != nil {
		t.Fatalf("Error loading .env file: %v", err)
	}

	// Check if DATABASE_URL is set
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		t.Fatal("DATABASE_URL environment variable is not set in .env")
	}

	// Initialize the database connection
	db.InitDB()

	// Check if the global DB object is initialized
	if db.DB == nil {
		t.Fatal("Failed to initialize database connection: DB is nil")
	}

	// Verify the connection
	sqlDB, err := db.DB.DB() // Get *sql.DB from GORM
	if err != nil {
		t.Fatalf("Failed to get SQL DB from GORM: %v", err)
	}
	defer sqlDB.Close()

	if err := sqlDB.Ping(); err != nil {
		t.Fatalf("Failed to ping database: %v", err)
	}

	t.Log("Database connection test passed!")
}
