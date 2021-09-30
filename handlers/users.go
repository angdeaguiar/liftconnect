package handlers

import (
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

const WeightVariation = 20

// GetUserHandler handles a GET request for retriving users, with optional
// filter querying.
func GetUserHandler(c *gin.Context) {
	var users []models.User

	models.DB.Where("first_name like %" + c.Query("firstname") + "%").Find(&users)

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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	user.Password = string(hashedPassword)

	models.DB.Create(&user)

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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	q := models.DB.Where("email = ?", credentials.Email).Find(&user)
	if q.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": q.Error})
		return
	}

	if len(user.ID) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user does not exist"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
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

	if err := models.DB.Where("id = ?", id).Find(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Where("user_id = ?", user.ID).Find(&prs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.
		Where("city like %"+user.City+"%").
		Where("bench between ? and ?", prs.Bench-WeightVariation, prs.Bench+WeightVariation).
		Or("squat between ? and ?", prs.Squat-WeightVariation, prs.Squat+WeightVariation).
		Or("deadlift between ? and ?", prs.Deadlift-WeightVariation, prs.Deadlift+WeightVariation).
		Find(&recommendedUsers); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recommendedUsers})
}

func GetUserByIDHandler(c *gin.Context) {
	id := c.Param("id")

	user := models.User{}
	ups := models.PersonalRecords{}

	if err := models.DB.Where("id = ?", id).Find(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Where("user_id = ?", id).Find(&ups); err != nil {
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&prs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prs})
}
