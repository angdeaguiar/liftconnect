package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

// GetWorkoutsByUserHandler handles a GET request for retrieving a given
// users workouts.
func GetWorkoutsByUserHandler(c *gin.Context) {
	var workouts []models.UserWorkout

	models.DB.Find(&workouts)

	c.JSON(http.StatusOK, gin.H{"data": workouts})
}
