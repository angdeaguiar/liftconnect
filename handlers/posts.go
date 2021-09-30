package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

// GetPostsByUserHandler handles a GET request for retrieving posts
// by a given user.
func GetPostsByUserHandler(c *gin.Context) {
	posts := []models.Post{}

	if err := models.DB.Find(&posts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

func CreatePostHandler(c *gin.Context) {

}

func CreateCommentHandler(c *gin.Context) {

}

func DeletePostHandler(c *gin.Context) {

}

func DeleteCommentHandler(c *gin.Context) {

}
