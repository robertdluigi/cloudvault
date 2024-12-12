// file.go
package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

// UploadFile handles file uploading
func UploadFile(w http.ResponseWriter, r *http.Request) {
	// Set a max upload size of 20 MB
	r.ParseMultipartForm(20 << 20)

	// Validate if a file is provided
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File upload failed. Please provide a valid file.", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validate file type
	fileType := header.Header.Get("Content-Type")
	validFileTypes := map[string]bool{
		"image/jpeg":      true,
		"image/png":       true,
		"application/pdf": true,
	}
	if !validFileTypes[fileType] {
		http.Error(w, "Unsupported file type. Only JPEG, PNG, and PDF are allowed.", http.StatusUnsupportedMediaType)
		return
	}

	// Create uploads directory if it does not exist
	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		err := os.Mkdir(uploadDir, 0755)
		if err != nil {
			http.Error(w, "Failed to create uploads directory", http.StatusInternalServerError)
			return
		}
	}

	// Save the file to the server
	filePath := filepath.Join(uploadDir, header.Filename)
	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to save the file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Failed to write the file", http.StatusInternalServerError)
		return
	}

	// Respond with success
	response := map[string]string{
		"message": "File uploaded successfully",
		"path":    filePath,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
