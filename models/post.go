package models

import "time"

// Post represents a single post within the application.
type Post struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	User      *User     `json:"user" sql:"-"`
	FileID    string    `json:"file_id,omitempty"`
	File      *File     `json:"file" sql:"-"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`

	Comments []*Comment `json:"comments" sql:"-"`
}

// Posts is a slice of a post.
type Posts []*Post

func (ps Posts) IDs() []string {
	ids := make([]string, len(ps))
	for i, p := range ps {
		ids[i] = p.ID
	}
	return ids
}

func (ps Posts) Map() map[string]*Post {
	m := make(map[string]*Post, len(ps))
	for i, p := range ps {
		m[p.ID] = ps[i]
	}
	return m
}
