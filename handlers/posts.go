package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

// GetPostsByUserHandler handles a GET request for retrieving posts
// by a given user.
func GetPostsByUserHandler(c *gin.Context) {
	var posts []models.Post

	models.DB.Find(&posts)

	c.JSON(http.StatusOK, gin.H{"data": posts})
}
