package handlers

import (
	"errors"
	"net/http"
	"regexp"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"

	"github.com/liftconnect/models"
)

const WeightVariation = 20

type UserFollow struct {
	models.User
	Following bool `json:"following"`
}

// GetUserHandler handles a GET request for retriving users, with optional
// filter querying.
func GetUserHandler(c *gin.Context) {
	users := []UserFollow{}
	filter := "%" + trim(c.Query("firstname")) + "%"

	if err := models.DB.
		Table("users").
		Select("users.*, exists"+
			"(select 1 from user_followings where user_id = ? and following_id = users.id)"+
			"as following", c.Param("id")).
		Where("users.first_name like ?", filter).
		Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": users})
}

// RegisterUserHandler handles a POST request for registering users.
func RegisterUserHandler(c *gin.Context) {
	user := models.User{}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	user.Password = string(hashedPassword)

	q := models.DB.Create(&user)
	if q.Error != nil {
		if models.DB.Where(models.User{Email: user.Email}).Take(&models.User{}).Error == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user already exists with this given email."})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{"error": q.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// UserLogin is a model representing the credentials a user needs to login
type UserLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginHandler handles a POST request for determining if the email
// and password is valid
func LoginHandler(c *gin.Context) {
	credentials := UserLogin{}
	user := models.User{}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Where("email = ?", credentials.Email).Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if len(user.ID) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user does not exist"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incorrect"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// RecommenedUserHandler finds users to recommend for a given user
// based on the city their from and their personal records.
func RecommendedUserHandler(c *gin.Context) {
	id := c.Param("id")

	user := models.User{}
	recommendedUsers := []models.User{}
	prs := models.PersonalRecords{}

	if err := models.DB.Where("id = ?", id).Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Where("user_id = ?", id).Find(&prs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.
		Select("users.*").
		Joins("left join personal_records on users.id = personal_records.user_id").
		Joins("left join user_followings on user_followings.following_id = users.id").
		Where("users.id != ?", id).
		Where("users.city = ?", user.City).
		Where("user_followings.user_id != ? or user_followings.user_id is null", id).
		Where("(personal_records.bench between ? and ?)"+
			"or (personal_records.squat between ? and ?)"+
			"or (personal_records.deadlift between ? and ?)",
			prs.Bench-WeightVariation, prs.Bench+WeightVariation,
			prs.Squat-WeightVariation, prs.Squat+WeightVariation,
			prs.Deadlift-WeightVariation, prs.Deadlift+WeightVariation).
		Find(&recommendedUsers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recommendedUsers})
}

// GetUserByID handler handles a GET request for retrieving a user by their id.
func GetUserByIDHandler(c *gin.Context) {
	id := c.Param("id")

	user := models.User{}
	ups := models.PersonalRecords{}

	if err := models.DB.Where("id = ?", id).Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	err := models.DB.Where("user_id = ?", id).Find(&ups).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	user.PersonalRecords = &ups

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// CreatePersonalRecordsHandler handles a POST request for persisting
// a record in the database of a users personal records.
func CreatePersonalRecordsHandler(c *gin.Context) {
	prs := models.PersonalRecords{}

	if err := c.ShouldBindJSON(&prs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Save(&prs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prs})
}

// FollowUserHandler handles a GET request for a user following another
// user.
func FollowUserHandler(c *gin.Context) {
	userFollowing := &models.UserFollowing{
		UserID:      c.Param("id"),
		FollowingID: c.Param("fid"),
	}

	if err := models.DB.Save(userFollowing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.Status(http.StatusOK)
}

// trim replaces all duplicate whitespace characters in s with a single space.
func trim(s string) string {
	return strings.TrimSpace(regexp.MustCompile(`(\w+):([0-9]\d{1,3})`).ReplaceAllString(s, " "))
}
