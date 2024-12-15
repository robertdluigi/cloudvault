package service

import (
	"backend/config"
	"backend/graph/model"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// sanitizeFilename removes any directory traversal elements to prevent security risks.
func sanitizeFilename(filename string) string {
	return strings.ReplaceAll(filepath.Base(filename), "..", "")
}

// FileUploadHandler handles the file upload, storage on disk, and database record creation.
func FileUploadHandler(ctx context.Context, file graphql.Upload, userID string) (*model.File, error) {
	// Ensure user ID is valid (passing it directly from the mutation argument)
	if userID == "" {
		return nil, errors.New("user not authenticated")
	}

	// Step 1: Process and sanitize the file name
	fileName := sanitizeFilename(file.Filename)
	filePath := filepath.Join("uploads", fileName) // Adjusted to a base directory

	// Ensure the "uploads" directory exists
	if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
		return nil, errors.Wrap(err, "unable to create uploads directory")
	}

	// Step 2: Create the file on the server's disk
	outFile, err := os.Create(filePath)
	if err != nil {
		return nil, errors.Wrap(err, "unable to create file")
	}
	defer outFile.Close()

	// Step 3: Write the uploaded file content to disk
	if _, err = io.Copy(outFile, file.File); err != nil {
		return nil, errors.Wrap(err, "unable to write file to disk")
	}

	// Step 4: Generate file metadata
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return nil, errors.Wrap(err, "unable to get file stats")
	}

	filesize := int(fileInfo.Size())
	fileURL := fmt.Sprintf("/uploads/%s", fileName) // URL for accessing the file
	fileID := uuid.New().String()

	// Step 5: Create a file model instance with metadata
	uploadedFile := &model.File{
		ID:        fileID,
		Filename:  fileName,
		Mimetype:  file.ContentType, // Ensure the correct MIME type is set
		Encoding:  "utf-8",          // Encoding type if relevant, otherwise remove
		Filesize:  filesize,
		URL:       fileURL,
		UserID:    userID,
		CreatedAt: time.Now(),
	}

	// Step 6: Save file details in the database directly
	db := config.GetDB()
	if err := db.Create(uploadedFile).Error; err != nil {
		return nil, errors.Wrap(err, "unable to save file metadata to database")
	}

	// Step 7: Return the uploaded file's metadata
	return uploadedFile, nil
}

// UserFiles retrieves a list of files for a specific user from the database
func UserFiles(ctx context.Context, userID string) ([]*model.File, error) {
	if userID == "" {
		return nil, errors.New("user ID cannot be empty")
	}

	db := config.GetDB()
	var files []*model.File

	if err := db.Where("user_id = ?", userID).Find(&files).Error; err != nil {
		return nil, errors.Wrapf(err, "failed to retrieve files for user %s", userID)
	}

	return files, nil
}

// UserDeleteFile deletes a file from the database and disk
func UserDeleteFile(ctx context.Context, fileID string) error {
	if fileID == "" {
		return errors.New("file ID cannot be empty")
	}

	db := config.GetDB()
	var file model.File

	// Step 1: Retrieve file metadata from the database
	if err := db.First(&file, "id = ?", fileID).Error; err != nil {
		return errors.Wrap(err, "file not found")
	}

	// Step 2: Delete the file from the server's disk
	if err := os.Remove(filepath.Join("uploads", file.Filename)); err != nil {
		return errors.Wrap(err, "failed to delete file from disk")
	}

	// Step 3: Remove file record from the database
	if err := db.Delete(&file).Error; err != nil {
		return errors.Wrap(err, "failed to delete file from database")
	}

	return nil
}
