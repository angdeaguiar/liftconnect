package models

import "time"

// UserWorkout represents a users workout
type UserWorkout struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	Notes     string    `json:"notes"`
	CreatedAt time.Time `json:"created_at"`

	WorkoutExercises []*WorkoutExercise `json:"workout_exercises" sql:"-"`
}
