package auth

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"backend/pkg/models"

	"github.com/dgrijalva/jwt-go"
)

// Secret key for signing the JWT tokens
var SecretKey = []byte("CLOUDVAULT-SECRET-JWT-KEY-DECQWKE53SKTEWSKKDUESJDN")

// Claims structure for JWT token claims
type Claims struct {
	ID    string `json:"user_id"`
	Email string `json:"email"`
	jwt.StandardClaims
}

// GenerateJWT generates a JWT token for a user
func GenerateJWT(userID, email string) (string, error) {
	claims := Claims{
		ID:    userID,
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
			Issuer:    "cloudvault",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateJWT validates the token and returns the user ID and email
func ValidateJWT(tokenString string) (*Claims, error) {
	// Parse the token and validate it
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

// SetTokenInCookie sets the JWT in a secure, HttpOnly cookie
func SetTokenInCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "authToken",                    // Name of the cookie
		Value:    token,                          // JWT token as value
		Path:     "/",                            // Cookie valid for the entire site
		Expires:  time.Now().Add(24 * time.Hour), // Expires in 24 hours
		HttpOnly: true,                           // Prevent JavaScript access (XSS protection)
		Secure:   false,                          // Set to true in production when using HTTPS
		SameSite: http.SameSiteStrictMode,        // Helps prevent CSRF
	})
}

// GetTokenFromCookie retrieves the JWT from the cookie
func GetTokenFromCookie(r *http.Request) (string, error) {
	cookie, err := r.Cookie("authToken")
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
}

// ClearTokenInCookie clears the JWT from the cookie
func ClearTokenInCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "authToken", // Same cookie name as before
		Value:    "",          // Set empty value to clear it
		Path:     "/",
		Expires:  time.Now().Add(-time.Hour), // Expire it immediately
		HttpOnly: true,                       // Prevent JavaScript access
		Secure:   false,                      // Set to true in production with HTTPS
		SameSite: http.SameSiteStrictMode,
	})
}

// Validate validates the user's JWT from the cookie and returns user information.
func Validate(w http.ResponseWriter, r *http.Request) {
	// Retrieve the JWT from the cookie
	tokenString, err := GetTokenFromCookie(r)
	if err != nil {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	// Validate the JWT
	claims, err := ValidateJWT(tokenString)
	if err != nil {
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}

	// Retrieve user profile data from the database
	user, err := models.GetProfileByEmail(claims.Email)
	if err != nil {
		http.Error(w, "Failed to retrieve user profile", http.StatusInternalServerError)
		return
	}

	// Respond with user information
	response := map[string]interface{}{
		"user_id":    user.ID,
		"email":      claims.Email,
		"username":   user.Username,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
