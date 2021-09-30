package models

// Post represents a single post within the application
type Post struct {
	ID        string `json:"id"`
	UserID    string `json:"user_id"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`

	Comments []*Comment `json:"comments" sql:"-"`
}
