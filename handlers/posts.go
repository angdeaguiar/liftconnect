package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

// GetPostsByUserHandler handles a GET request for retrieving posts
// by a given user.
func GetPostsByUserHandler(c *gin.Context) {
	posts := models.Posts{}
	comments := []*models.Comment{}

	id := c.Param("id")

	if err := models.DB.
		Select("posts.*").
		Joins("left join user_followings on posts.user_id = user_followings.following_id").
		Where("user_followings.user_id = ?", id).
		Where("posts.user_id = ? or user_followings.following_id is not null", id).
		Order("created_at desc").
		Find(&posts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.
		Where("post_id is in (?)", posts.IDs()).
		Group("post_id").
		Order("created_at desc").
		Find(comments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	m := posts.Map()
	for _, comment := range comments {
		if p, ok := m[comment.PostID]; ok {
			p.Comments = append(p.Comments, comment)
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// CreatePostHandler handles a POST request for creating a post.
func CreatePostHandler(c *gin.Context) {
	post := models.Post{}

	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.Status(http.StatusOK)
}

// CreateCommentHanlder handles a POST request for creating a comment.
func CreateCommentHandler(c *gin.Context) {
	comment := models.Comment{}

	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.Status(http.StatusOK)
}

// DeletePostHandler handles a DELETE request for deleting a post record.
func DeletePostHandler(c *gin.Context) {
	if err := models.DB.Where("id = ?", c.Param("id")).Find(&models.Post{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.Status(http.StatusOK)
}

// DeleteCommentHandler handles a DELETE request for deleting a comment record.
func DeleteCommentHandler(c *gin.Context) {
	if err := models.DB.Where("id = ?", c.Param("id")).Find(&models.Comment{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.Status(http.StatusOK)
}
