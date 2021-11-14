package models

// File represents a single file attachment on a post.
type File struct {
	ID       string  `json:"id"`
	Filename string  `json:"filename"`
	S3URL    string  `json:"s3_url"`
	FileType string  `json:"file_type"`
	Size     float64 `json:"size"`
}
