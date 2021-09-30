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

	api := router.Group("/api")

	// Users
	api.GET("/users", handlers.GetUserHandler)
	api.GET("/users/recommend/:id", handlers.RecommendedUserHandler)
	api.GET("/users/:id", handlers.GetUserByIDHandler)
	api.POST("/users/register", handlers.RegisterUserHandler)
	api.POST("/users/login", handlers.LoginHandler)
	api.POST("users/personalrecords", handlers.CreatePersonalRecordsHandler)

	// Posts
	api.GET("/posts", handlers.GetPostsByUserHandler)

	// Workouts
	api.GET("/workouts/:uid", handlers.GetWorkoutsByUserHandler)
	api.GET("/workouts/exercises", handlers.GetExercisesHandler)
	api.GET("/workouts/exercises/:target", handlers.GetExercisesByTargetHandler)
	api.GET("/workouts/exercises/:name", handlers.GetExercisesByNameHandler)
	api.POST("/workouts", handlers.CreateWorkoutHandler)

	// Start and run the server
	router.Run(":3000")
}
