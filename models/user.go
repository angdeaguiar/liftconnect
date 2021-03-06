package models

import "time"

type Pronouns string

const (
	She  = Pronouns("she/her")
	He   = Pronouns("he/him")
	They = Pronouns("they/them")
)

// User represents a single person within the application
type User struct {
	ID        string    `json:"id"`
	FirstName string    `json:"first_name" binding:"required"`
	LastName  string    `json:"last_name" binding:"required"`
	Email     string    `json:"email" binding:"required"`
	Password  string    `json:"password" binding:"required"`
	City      string    `json:"city" binding:"required"`
	Pronouns  *Pronouns `json:"pronouns"`
	CreatedAt time.Time `json:"created_at"`

	PersonalRecords *PersonalRecords `json:"personal_records,omitempty" sql:"-"`
}

// Users is a slice of a user.
type Users []*User

func (us Users) IDs() []string {
	ids := make([]string, len(us))
	for i, u := range us {
		ids[i] = u.ID
	}
	return ids
}
