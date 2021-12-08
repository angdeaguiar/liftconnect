package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

var filepath string

// GetPostsByUserHandler handles a GET request for retrieving posts
// by a given user.
func GetPostsByUserHandler(c *gin.Context) {
	posts := models.Posts{}
	comments := []*models.Comment{}

	id := c.Param("id")

	if err := models.DB.
		Select("posts.*").
		Joins("left join user_followings on posts.user_id = user_followings.following_id").
		Where("user_followings.user_id = ? or posts.user_id = ?", id, id).
		Order("posts.created_at desc").
		Find(&posts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	for _, post := range posts {
		if err := mapUserToPost(post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "unable to fetch user for post"})
			return
		}

		if len(post.FileID.String) > 0 {
			if err := mapFileToPost(post); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "unable to fetch a file for post"})
				return
			}
		}
	}

	if err := models.DB.
		Where("post_id in (?)", posts.IDs()).
		Group("post_id, id").
		Order("created_at").
		Find(&comments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if len(comments) > 0 {
		m := posts.Map()
		for _, comment := range comments {
			if p, ok := m[comment.PostID]; ok {
				p.Comments = append(p.Comments, comment)
			}

			if err := mapUserToComment(comment); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "unable to fetch user for posts"})
				return
			}
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
	if err := models.DB.Where("id = ?", c.Param("id")).Delete(&models.Post{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.Status(http.StatusOK)
}

// DeleteCommentHandler handles a DELETE request for deleting a comment record.
func DeleteCommentHandler(c *gin.Context) {
	if err := models.DB.Where("id = ?", c.Param("id")).Delete(&models.Comment{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.Status(http.StatusOK)
}

// UploadFileHandler handles a post reqest for uploading a file to s3 for a post.
func UploadFileHandler(c *gin.Context) {
	sess := c.MustGet("sess").(*session.Session)
	uploader := s3manager.NewUploader(sess)

	bucket := os.Getenv("BUCKET_NAME")

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	filename := header.Filename

	upload, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(bucket),
		ACL:    aws.String("public-read"),
		Key:    aws.String(filename),
		Body:   file,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "Failed to upload file",
			"uploader": upload,
		})

		return
	}

	filepath = "https://" + bucket + "." + "s3-us-east-2.amazonaws.com/" + filename

	f := models.File{
		Filename: filename,
		S3URL:    filepath,
		FileType: c.Param("type"),
		Size:     float64(header.Size),
	}

	if err := models.DB.Create(&f).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": f})
}

// mapUserToPost associates a user with a gien post.
func mapUserToPost(post *models.Post) error {
	user := models.User{}
	if err := models.DB.Where("id = ?", post.UserID).Find(&user).Error; err != nil {
		return err
	}

	post.User = &user

	return nil
}

// mapUserToPost associates a file with a gien post.
func mapFileToPost(post *models.Post) error {
	file := models.File{}
	if err := models.DB.Where("id = ?", post.FileID).Find(&file).Error; err != nil {
		return err
	}

	post.File = &file

	return nil
}

// mapUserToComment associates a user to a given comment.
func mapUserToComment(comment *models.Comment) error {
	user := models.User{}
	if err := models.DB.Where("id = ?", comment.UserID).Find(&user).Error; err != nil {
		return err
	}

	comment.User = &user

	return nil
}
