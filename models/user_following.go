package models

// UserFollowing represents a relationship between a user following another
// user
type UserFollowing struct {
	FollowingID string `json:"following_id"`
	UserID      string `json:"user_id"`
}
