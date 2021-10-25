package models

// WorkoutSet represents each set from an exercise of a users workout.
type WorkoutSet struct {
	ID         string `json:"id"`
	ExerciseID string `json:"exercise_id"`
	SetNumber  int    `json:"set_number"`
	Reps       int    `json:"reps"`
	Weight     int    `json:"weight"`
}
