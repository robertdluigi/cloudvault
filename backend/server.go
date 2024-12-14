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

	// Start the server

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))

}
