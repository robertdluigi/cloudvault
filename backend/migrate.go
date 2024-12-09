package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib" // PostgreSQL driver
	"github.com/joho/godotenv"         // godotenv package for loading environment variables
)

var db *sql.DB

// Initialize the database connection
func initDB() (*sql.DB, error) {
	// Load environment variables from the .env file
	if err := godotenv.Load(); err != nil {
		return nil, fmt.Errorf("error loading .env file: %v", err)
	}

	// Get the DATABASE_URL from the environment variables
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set in .env")
	}

	var err error
	db, err = sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	return db, nil
}

// Create the users table
func createTables() error {
	// SQL statement to create the users table
	query := `CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username VARCHAR(255) NOT NULL UNIQUE,
		password VARCHAR(255) NOT NULL
	);`

	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}

	log.Println("Users table created successfully!")
	return nil
}

func main() {
	// Initialize database connection
	db, err := initDB()
	if err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}
	defer db.Close()

	// Create necessary tables
	err = createTables()
	if err != nil {
		log.Fatalf("Error creating tables: %v", err)
	}
}
