package migration

import (
	"backend/config"
	"backend/graph/model"
)

func MigrateTable() {
	db := config.GetDB()

	db.AutoMigrate(&model.User{})
}
