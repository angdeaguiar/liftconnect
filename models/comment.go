package models

import "time"

// Comment represents a single comment on a post.
type Comment struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	User      *User     `json:"user" sql:"-"`
	PostID    string    `json:"post_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
