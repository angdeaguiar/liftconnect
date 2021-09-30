package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/liftconnect/handlers"
	"github.com/liftconnect/models"
)

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./web/js", true)))

	// Setup route group for the API
	models.ConnectDataBase()

	// Users
	router.GET("api/users", handlers.GetUserHandler)
	router.POST("api/users/register", handlers.RegisterUserHandler)
	router.POST("api/users/login", handlers.LoginHandler)

	// Posts
	router.GET("api/posts", handlers.GetPostsByUserHandler)

	// Workouts
	router.GET("api/workouts", handlers.GetWorkoutsByUserHandler)

	// Start and run the server
	router.Run(":3000")
}
