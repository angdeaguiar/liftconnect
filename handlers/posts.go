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

func CreatePostHandler(c *gin.Context) {

}

func CreateCommentHandler(c *gin.Context) {

}

func DeletePostHandler(c *gin.Context) {

}

func DeleteCommentHandler(c *gin.Context) {

}
