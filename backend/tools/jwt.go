package tools

import (
	"context"
	"errors"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

var jwtSecret = []byte(getJwtSecret())

func getJwtSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "aSecret"
	}
	return secret
}

// GetAuthTokenFromContext retrieves the auth token from the context (could be from headers).
func GetAuthTokenFromContext(ctx context.Context) (string, error) {
	// Retrieve the "Authorization" header from the context
	authHeader, ok := ctx.Value("Authorization").(string)
	if !ok {
		return "", errors.New("authorization header missing or malformed")
	}

	// Check if the token has the "Bearer " prefix
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return "", errors.New("authorization header missing 'Bearer' prefix")
	}

	// Extract the token by trimming the 'Bearer ' prefix
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	return tokenString, nil
}

// ParseToken parses the JWT token and returns a token object.
func ParseToken(tokenString string) (*jwt.Token, error) {

	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the token's signing method is correct
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})
	return token, err
}
