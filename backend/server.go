package main

import (
	"backend/config"
	"backend/graph"
	"backend/graph/generated"
	"backend/internal/directives"
	"backend/internal/middlewares"
	migration "backend/scripts"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const defaultPort = "8080"

func main() {

	// Migrate the database
	migration.MigrateTable()

	// Setup default PORT if not set in .env
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Defer Closing the DB connection
	db := config.GetDB()
	pgDB, _ := db.DB()
	defer pgDB.Close()

	c := generated.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth

	router := mux.NewRouter()
	router.Use(middlewares.AuthMiddleware)

	// Configure CORS
	corsAllowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	corsAllowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"})
	corsAllowedHeaders := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	corsAllowCredentials := handlers.AllowCredentials()

	// Start the server
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, handlers.CORS(corsAllowedOrigins, corsAllowedMethods, corsAllowedHeaders, corsAllowCredentials)(router)))
}
