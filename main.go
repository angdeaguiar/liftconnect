package main

import (
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/liftconnect/handlers"
	"github.com/liftconnect/models"
)

var AccessKeyID string
var SecretAccessKey string
var MyRegion string

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, HEAD, PATCH, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func LoadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
		return
	}
}

func GetEnvWithKey(key string) string {
	return os.Getenv(key)
}

func ConnectAws() *session.Session {
	AccessKeyID = GetEnvWithKey("AWS_ACCESS_KEY_ID")
	SecretAccessKey = GetEnvWithKey("AWS_SECRET_ACCESS_KEY")
	MyRegion = GetEnvWithKey("AWS_REGION")

	sess, err := session.NewSession(
		&aws.Config{
			Region: aws.String(MyRegion),
			Credentials: credentials.NewStaticCredentials(
				AccessKeyID,
				SecretAccessKey,
				"", // a token will be created when the session it's used.
			),
		})

	if err != nil {
		log.Fatalf("Unable to create AWS session")
	}

	return sess
}

func main() {
	LoadEnv()

	sess := ConnectAws()

	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Configure Cors
	router.Use(CORSMiddleware())

	// Configure AWS
	router.Use(func(c *gin.Context) {
		c.Set("sess", sess)
		c.Next()
	})

	// Setup route group for the API
	models.ConnectDataBase()

	// Session
	router.GET("/self", handlers.UserHandler)
	router.POST("/self/login", handlers.LoginHandler)
	router.GET("/self/logout", handlers.LogoutHandler)

	api := router.Group("/api")

	// Users
	api.GET("/users/all/:id", handlers.GetUserHandler)
	api.GET("/users/recommend/:id", handlers.RecommendedUserHandler)
	api.GET("/users/:id", handlers.GetUserByIDHandler)
	api.POST("/users/register", handlers.RegisterUserHandler)
	api.POST("/users/personalrecords", handlers.CreatePersonalRecordsHandler)
	api.POST("/users/:id/follow/:fid", handlers.FollowUserHandler)

	// Posts
	api.GET("/posts/:id", handlers.GetPostsByUserHandler)
	api.POST("/posts", handlers.CreatePostHandler)
	api.POST("/posts/comment", handlers.CreateCommentHandler)
	api.POST("/posts/upload/:type", handlers.UploadFileHandler)
	api.DELETE("/posts/:id", handlers.DeletePostHandler)
	api.DELETE("posts/comment/:id", handlers.DeleteCommentHandler)

	// Workouts
	api.GET("/workouts/:uid", handlers.GetWorkoutsByUserHandler)
	api.GET("/workouts/exercises", handlers.GetExercisesHandler)
	api.GET("/workouts/exercises/target/:target", handlers.GetExercisesByTargetHandler)
	api.GET("/workouts/exercises/name/:name", handlers.GetExercisesByNameHandler)
	api.POST("/workouts", handlers.CreateWorkoutHandler)

	// Start and run the server
	router.Run(":8080")
}
