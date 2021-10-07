package handlers

import (
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

const RapidAPIURL = "https://exercisedb.p.rapidapi.com/exercises"
const RapidAPIKey = "f565efb29bmsh082cbc3f9d47ae5p10610ejsn44d0b8c6b33d"
const RapidAPIHost = "exercisedb.p.rapidapi.com"

// GetWorkoutsByUserHandler handles a GET request for retrieving a given
// users workouts.
func GetWorkoutsByUserHandler(c *gin.Context) {
	workouts := models.UserWorkouts{}
	exercises := []*models.WorkoutExercise{}

	if err := models.DB.Where("user_id = ?", c.Param("id")).Find(workouts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.
		Where("workout_id in (?)", workouts.IDs()).
		Group("workout_id").
		Order("exercise_order asc").
		Find(&exercises).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	m := workouts.Map()
	for _, exercise := range exercises {
		if w, ok := m[exercise.WorkoutID]; ok {
			w.WorkoutExercises = append(w.WorkoutExercises, exercise)
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": workouts})
}

// GetExercisesHandler handles a GET request for retrieving all the
// exercises from RapidAPI's ExerciseDB API.
func GetExercisesHandler(c *gin.Context) {
	req, _ := http.NewRequest("GET", RapidAPIURL, nil)

	req.Header.Add("x-rapidapi-host", RapidAPIHost)
	req.Header.Add("x-rapidapi-key", RapidAPIKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	// Formatting the response body.
	exercises := []byte(`{"data": ` + string(body) + `}`)

	c.Data(http.StatusOK, "application/json", exercises)
}

// GetExerciseByTargetHandler handles a GET request for retrieving exercises
// by a body part from RapidAPI's ExerciseDB API.
func GetExercisesByTargetHandler(c *gin.Context) {
	target := "/bodyPart/%7B" + c.Param("target") + "%7D"

	req, _ := http.NewRequest("GET", RapidAPIURL+target, nil)

	req.Header.Add("x-rapidapi-host", RapidAPIHost)
	req.Header.Add("x-rapidapi-key", RapidAPIKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	// Formatting the response body.
	exercises := []byte(`{"data": ` + string(body) + `}`)

	c.Data(http.StatusOK, "application/json", exercises)
}

// GetExercisesByNameHandler handles a GET request for retrieving exercises
// by a name from RapidAPI's ExerciseDB API.
func GetExercisesByNameHandler(c *gin.Context) {
	name := "/name/%7B" + c.Param("name") + "%7D"

	req, _ := http.NewRequest("GET", RapidAPIURL+name, nil)

	req.Header.Add("x-rapidapi-host", RapidAPIHost)
	req.Header.Add("x-rapidapi-key", RapidAPIKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	// Formatting the response body.
	exercises := []byte(`{"data": ` + string(body) + `}`)

	c.Data(http.StatusOK, "application/json", exercises)
}

// CreateWorkoutHandler handles a POST request for saving a users
// workout and all the exercises to the database.
func CreateWorkoutHandler(c *gin.Context) {
	workout := models.UserWorkout{}

	if err := c.ShouldBindJSON(&workout); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.Save(&workout); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if len(workout.WorkoutExercises) > 0 {
		for i, exercise := range workout.WorkoutExercises {
			if err := models.DB.Create(&models.WorkoutExercise{
				WorkoutID:     workout.ID,
				ApiID:         exercise.ApiID,
				Name:          exercise.Name,
				Sets:          exercise.Sets,
				Reps:          exercise.Reps,
				ExerciseOrder: i,
				GifURL:        exercise.GifURL,
			}).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err})
				return
			}
		}
	}

	c.Status(http.StatusOK)
}
