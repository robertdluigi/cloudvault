package auth

import (
	"backend/graph/model"
	"backend/internal/middlewares"
	"backend/internal/service"
	"context"
	"fmt"
)

func ValidateAuth(ctx context.Context) (*model.User, error) {
	// Retrieve the custom claim from the context
	customClaim := middlewares.CtxValue(ctx)
	if customClaim == nil {
		return nil, fmt.Errorf("failed to extract token from context: authorization header missing or malformed")
	}

	// Retrieve the user ID from the claims
	userID := customClaim.ID
	if userID == "" {
		return nil, fmt.Errorf("invalid token claims: missing user ID")
	}

	// Retrieve the user from the database or service
	user, err := service.UserGetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	return user, nil
}
