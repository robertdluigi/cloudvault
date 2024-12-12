package middleware

import (
	"backend/pkg/auth"
	"context"
	"net/http"
)

// AuthMiddleware is a middleware to protect private routes by verifying JWT token in cookies
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract the token from the "authToken" cookie
		tokenString, err := auth.GetTokenFromCookie(r)
		if err != nil || tokenString == "" {
			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
			return
		}

		// Validate the JWT token
		claims, err := auth.ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Attach the claims to the request context (this will be available in the next handler)
		ctx := r.Context()
		ctx = context.WithValue(ctx, "userID", claims.ID)
		ctx = context.WithValue(ctx, "email", claims.Email)

		// Call the next handler with the new context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
