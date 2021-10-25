package models

// WorkoutExercise represents each exercise from a users workout
type WorkoutExercise struct {
	ID        string `json:"id"`
	WorkoutID string `json:"workout_id"`
	ApiID     string `json:"api_id"`
	Name      string `json:"name"`
	GifURL    string `json:"gif_url"`

	WorkoutSets []*WorkoutSet `json:"workout_sets" sql:"-"`
}
