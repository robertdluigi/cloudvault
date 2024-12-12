package handlers

import (
	"backend/pkg/db"
	"backend/pkg/models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// Create GetFilesByUserID function
func GetFilesByUserID(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the request
	vars := mux.Vars(r)
	userID := vars["userID"]

	// Query the database to get only the fields we need
	var files []models.FileModel
	if err := db.DB.Select("id", "user_id", "access_key", "file_type", "file_url", "file_name", "file_size", "created_at", "updated_at").
		Where("user_id = ?", userID).Find(&files).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "No files found for the user", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Error retrieving files: %v", err), http.StatusInternalServerError)
		}
		return
	}

	// Map the files into FileResponse structs
	var fileResponses []models.FileResponse
	for _, file := range files {
		fileResponses = append(fileResponses, models.FileResponse{
			ID:        file.ID,
			UserID:    file.UserID,
			AccessKey: file.AccessKey,
			FileType:  file.FileType,
			FileURL:   file.FileURL,
			FileName:  file.FileName,
			FileSize:  file.FileSize,
			CreatedAt: file.CreatedAt.String(),
			UpdatedAt: file.UpdatedAt.String(),
		})
	}

	// Return the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(fileResponses); err != nil {
		http.Error(w, "Failed to encode files response", http.StatusInternalServerError)
	}
}
