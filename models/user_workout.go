package models

import "time"

// UserWorkout represents a users workout.
type UserWorkout struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	Notes     string    `json:"notes"`
	CreatedAt time.Time `json:"created_at"`

	WorkoutExercises []*WorkoutExercise `json:"workout_exercises" sql:"-"`
}

// UserWorkouts is a slice of a a user's workout.
type UserWorkouts []*UserWorkout

// IDs returns a slice of id's from UserWorkouts
func (uws UserWorkouts) IDs() []string {
	ids := make([]string, len(uws))
	for i, uw := range uws {
		ids[i] = uw.ID
	}
	return ids
}

// Map creates a map of UserWorkouts.
func (uws UserWorkouts) Map() map[string]*UserWorkout {
	m := make(map[string]*UserWorkout, len(uws))
	for i, uw := range uws {
		m[uw.ID] = uws[i]
	}
	return m
}
