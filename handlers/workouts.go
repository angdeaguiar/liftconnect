package handlers

import (
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/liftconnect/models"
)

// GetWorkoutsByUserHandler handles a GET request for retrieving a given
// users workouts.
func GetWorkoutsByUserHandler(c *gin.Context) {
	workouts := models.UserWorkouts{}
	exercises := models.WorkoutExercises{}

	sets := []*models.WorkoutSet{}

	if err := models.DB.Where("user_id = ?", c.Param("uid")).Order("created_at desc").Find(&workouts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.
		Where("workout_id in (?)", workouts.IDs()).
		Find(&exercises).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := models.DB.
		Where("exercise_id in (?)", exercises.IDs()).
		Order("set_number").
		Find(&sets).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	m := workouts.Map()
	for _, exercise := range exercises {
		if w, ok := m[exercise.WorkoutID]; ok {
			w.WorkoutExercises = append(w.WorkoutExercises, exercise)
		}
	}

	me := exercises.Map()
	for _, set := range sets {
		if w, ok := me[set.ExerciseID]; ok {
			w.WorkoutSets = append(w.WorkoutSets, set)
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": workouts})
}

// GetExercisesHandler handles a GET request for retrieving all the
// exercises from RapidAPI's ExerciseDB API.
func GetExercisesHandler(c *gin.Context) {
	req, _ := http.NewRequest("GET", getEnvWithKey("RAPID_API_URL"), nil)

	req.Header.Add("x-rapidapi-host", getEnvWithKey("RAPID_API_HOST"))
	req.Header.Add("x-rapidapi-key", getEnvWithKey("RAPID_API_KEY"))

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
	target := "/target/" + c.Param("target")

	req, _ := http.NewRequest("GET", getEnvWithKey("RAPID_API_URL")+target, nil)

	req.Header.Add("x-rapidapi-host", getEnvWithKey("RAPID_API_HOST"))
	req.Header.Add("x-rapidapi-key", getEnvWithKey("RAPID_API_KEY"))

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
	name := "/name/" + c.Param("name")

	req, _ := http.NewRequest("GET", getEnvWithKey("RAPID_API_URL")+name, nil)

	req.Header.Add("x-rapidapi-host", getEnvWithKey("RAPID_API_HOST"))
	req.Header.Add("x-rapidapi-key", getEnvWithKey("RAPID_API_KEY"))

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

	if err := models.DB.Create(&workout).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if len(workout.WorkoutExercises) > 0 {
		for _, exercise := range workout.WorkoutExercises {
			we := &models.WorkoutExercise{
				WorkoutID: workout.ID,
				ApiID:     exercise.ApiID,
				Name:      exercise.Name,
				GifURL:    exercise.GifURL,
			}

			q := models.DB.Create(we)
			if q.Error != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": q.Error})
				return
			}

			for _, set := range exercise.WorkoutSets {
				if err := models.DB.Create(&models.WorkoutSet{
					ExerciseID: we.ID,
					SetNumber:  set.SetNumber,
					Reps:       set.Reps,
					Weight:     set.Weight,
				}).Error; err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err})
					return
				}
			}
		}
	}

	c.Status(http.StatusOK)
}

func getEnvWithKey(key string) string {
	return os.Getenv(key)
}
