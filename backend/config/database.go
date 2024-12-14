package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var (
	db *gorm.DB
)

func GetDB() *gorm.DB {
	return db
}

func init() {
	godotenv.Load()
	connectDatabase()
}

func connectDatabase() {
	// Get the DATABASE_URL from environment variables
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	var err error
	db, err = gorm.Open(postgres.Open(databaseURL), initConfig())
	if err != nil {
		panic("Failed to connect to the database: " + err.Error())
	}
}

// InitConfig initializes GORM configuration
func initConfig() *gorm.Config {
	return &gorm.Config{
		Logger:         initLog(),
		NamingStrategy: initNamingStrategy(),
	}
}

// InitLog initializes the logger configuration
func initLog() logger.Interface {
	file, _ := os.Create("gorm.log")
	newLogger := logger.New(
		log.New(file, "\r\n", log.LstdFlags),
		logger.Config{
			Colorful:      true,
			LogLevel:      logger.Info,
			SlowThreshold: time.Second,
		},
	)
	return newLogger
}

// InitNamingStrategy initializes naming strategy
func initNamingStrategy() *schema.NamingStrategy {
	return &schema.NamingStrategy{
		SingularTable: false,
		TablePrefix:   "",
	}
}
