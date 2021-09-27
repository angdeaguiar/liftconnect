package models

// PersonalRecords represents a single record of a users personal records
type PersonalRecords struct {
	ID       string `json:"id"`
	UserID   string `json:"user_id"`
	Squat    int    `json:"squat"`
	Deadlift int    `json:"deadlift"`
	Bench    int    `json:"bench"`
}
