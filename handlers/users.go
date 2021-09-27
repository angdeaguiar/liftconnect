package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

// GetUserHandler handles a GET request for retriving users.
func GetUserHandler(c *gin.Context) {
	var users []models.User

	models.DB.Find(&users)

	c.JSON(http.StatusOK, gin.H{"data": users})
}

// RegisterUserHandler handles a POST request for registering users.
func RegisterUserHandler(c *gin.Context) {
	user, userEmail := models.User{}, models.User{}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if Email has already been used
	q := models.DB.Where("email = ?", user.Email).Find(&userEmail)
	if q.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": q.Error})
		return
	}

	if q.RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email is already registered"})
		return
	}

	models.DB.Create(&user)

	c.JSON(http.StatusOK, gin.H{"data": user})
}
