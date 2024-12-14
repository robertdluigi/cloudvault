// backend/internal/auth/auth.go

package auth

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var secretKey = []byte("CLOUD-VAULT-JWT-SECRET-KEY-QWERTY8Z8Z8Z8")

// Claims struct defines the structure of the JWT claims
type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.StandardClaims
}

// GetTokenFromContext extracts the JWT token from the context (assumed to be set by middleware)
func GetTokenFromContext(ctx context.Context) (string, error) {
	// Retrieve the token from the context (this can be set in the middleware)
	token, ok := ctx.Value("token").(string)
	if !ok {
		return "", errors.New("no token found in context")
	}
	return token, nil
}

// ExtractTokenFromHeader retrieves the JWT token from the HTTP request header (Authorization)
func ExtractTokenFromHeader(authorizationHeader string) (string, error) {
	// Check if the Authorization header starts with "Bearer "
	if !strings.HasPrefix(authorizationHeader, "Bearer ") {
		return "", errors.New("authorization header is missing 'Bearer' token")
	}

	// Extract the token by removing the "Bearer " prefix
	token := strings.TrimPrefix(authorizationHeader, "Bearer ")
	return token, nil
}

// GenerateJWT creates a new JWT token for the user
func GenerateJWT(userID, email string) (string, error) {
	claims := Claims{
		UserID: userID,
		Email:  email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
			Issuer:    "your_app_name",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

// ValidateJWT checks if the token is valid and returns the claims
func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// SetTokenInCookie sets the JWT token in a secure, HTTP-only cookie
func SetTokenInCookie(w http.ResponseWriter, token string) {
	// Set cookie expiration time (e.g., 24 hours)
	expiration := time.Now().Add(24 * time.Hour)

	// Create the cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",            // Cookie name
		Value:    token,                   // JWT token
		Path:     "/",                     // Available throughout the entire domain
		Expires:  expiration,              // Expiration time
		HttpOnly: true,                    // Ensures the cookie is not accessible via JavaScript (prevents XSS attacks)
		Secure:   true,                    // Ensures the cookie is sent over HTTPS
		SameSite: http.SameSiteStrictMode, // Ensures the cookie is sent only in requests from the same site
	})
}
