package models

// WorkoutExercise represents each exercise from a users workout
type WorkoutExercise struct {
	ID        string `json:"id"`
	WorkoutID string `json:"workout_id"`
	ApiID     string `json:"api_id"`
	Name      string `json:"name"`
	Sets      int    `json:"sets"`
	Reps      int    `json:"reps"`
	Order     int    `json:"order"`
}
