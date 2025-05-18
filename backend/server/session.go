package server

import (
	"sync"

	"github.com/c1te/collab/backend/redisclient"
	"github.com/gorilla/websocket"
)

// Improve: Cleanup Idle Sesison and Doc related to it in Redis
type Session struct {
	ID      string
	Clients []*Client
	mu      sync.Mutex
}

type Client struct {
	Conn *websocket.Conn
	Mu   sync.Mutex
}

var sessions = make(map[string]*Session)
var sessionsMu sync.Mutex

// Use maps for client to improve fetch times
func NewSession(sessionID string) (*Session, error) {
	err := redisclient.Client.Set(redisclient.Ctx, sessionID, "", 0).Err()

	if err != nil {
		return nil, err
	}

	session := &Session{
		ID:      sessionID,
		Clients: []*Client{},
	}
	return session, nil
}

func GetOrCreateNewSession(sessionID string) (*Session, error) {
	sessionsMu.Lock()
	defer sessionsMu.Unlock()

	if session, exists := sessions[sessionID]; exists {
		return session, nil
	}

	session, err := NewSession(sessionID)
	if err != nil {
		return nil, err
	}
	sessions[sessionID] = session

	return session, nil

}

func GetSession(sessionID string) *Session {
	sessionsMu.Lock()
	defer sessionsMu.Unlock()

	session := sessions[sessionID]
	return session
}

func (s *Session) AddClientToSession(sessionID string, client *Client) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.Clients = append(s.Clients, client)
}

//Using Map istead of Array in Sesion will help with operation time

func (s *Session) RemoveClientFromSession(sessionID string, client *Client) {
	s.mu.Lock()
	defer s.mu.Unlock()

	clients := s.Clients[:0]
	for _, c := range s.Clients {
		if c != client {
			clients = append(clients, client)
		}
	}

	s.Clients = clients
}
