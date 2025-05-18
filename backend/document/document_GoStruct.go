package document

//Mutex For Data Integrity in COncurrent Programming

import (
	"sync"
)

// RWmutex is better for collaborative env.It has read lock and conccurent read which is not present in mutex
// RWmutex if more reads less write
// Mutex for Write Heavy
type Document struct {
	Content string
	mu      sync.RWMutex
}

func NewDocument(content string) *Document {
	return &Document{
		Content: content,
	}
}

func (d *Document) InsertAt(pos int, content string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if pos < 0 || pos > len(d.Content) {
		pos = len(d.Content)
	}

	d.Content = d.Content[:pos] + content + d.Content[pos:]
}

func (d *Document) DeleteAt(pos int, length int) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if pos < 0 || pos >= len(d.Content) {
		return
	}

	end := pos + length
	if end > len(d.Content) {
		end = len(d.Content)
	}

	d.Content = d.Content[:pos] + d.Content[end:]
}

func (d *Document) ReplaceAt(pos int, length int, content string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if pos < 0 || pos >= len(d.Content) {
		return
	}

	end := pos + length

	if end > len(d.Content) {
		end = len(d.Content)
	}
	d.Content = d.Content[:pos] + content + d.Content[end:]
}

func (d *Document) SetContent(content string) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.Content = content
}

func (d *Document) GetContent() string {
	d.mu.Lock()
	defer d.mu.Unlock()

	return d.Content

}
