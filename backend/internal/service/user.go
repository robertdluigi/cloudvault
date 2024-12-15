package service

import (
	"backend/config"
	"backend/graph/model"
	"backend/tools"
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

func UserCreate(ctx context.Context, input model.SignUp) (*model.User, error) {
	db := config.GetDB()

	input.Password = tools.HashPassword(input.Password)

	user := model.User{
		ID:        uuid.New().String(),
		Username:  input.Username,
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Email:     strings.ToLower(input.Email),
		Password:  input.Password,
	}

	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("email LIKE ?", email).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func ValidateAuth(ctx context.Context) (*model.User, error) {
	// Retrieve the token from the context
	tokenString, err := tools.GetAuthTokenFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to extract token from context: %w", err)
	}

	// Validate the token
	token, err := JwtValidate(ctx, tokenString)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	// Extract claims from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	// Retrieve user ID from claims
	userID, ok := claims["id"].(string)
	if !ok {
		return nil, errors.New("invalid token claims: missing user ID")
	}

	// Retrieve the user from the database or service
	user, err := UserGetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	return user, nil
}
