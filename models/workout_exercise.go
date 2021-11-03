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

// WorkoutExercise is a slice of a the exercises in a workout.
type WorkoutExercises []*WorkoutExercise

// IDs returns a slice of id's from WorkoutExercises
func (we WorkoutExercises) IDs() []string {
	ids := make([]string, len(we))
	for i, w := range we {
		ids[i] = w.ID
	}
	return ids
}

// Map creates a map of WorkoutExercises.
func (we WorkoutExercises) Map() map[string]*WorkoutExercise {
	m := make(map[string]*WorkoutExercise, len(we))
	for i, w := range we {
		m[w.ID] = we[i]
	}
	return m
}
