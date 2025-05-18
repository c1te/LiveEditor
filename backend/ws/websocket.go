package ws

import (
	"log"
	"net/http"

	"github.com/c1te/collab/backend/document"
	"github.com/c1te/collab/backend/server"
	"github.com/gorilla/websocket"
	"github.com/teris-io/shortid"
)

var upgrader = websocket.Upgrader{
	//Check for which connection are allowed to upgrade
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)

	client := &server.Client{
		Conn: conn,
	}

	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}

	sessionID := r.URL.Query().Get("session")

	if sessionID == "" {
		sessionID, _ = shortid.Generate()
		log.Println("Generated session ID:", sessionID)
	}

	sendMsg := func() {
		client.Mu.Lock()
		defer client.Mu.Unlock()
		_ = client.Conn.WriteJSON(map[string]string{"sessionID": sessionID})
	}

	sendMsg()

	session, err := server.GetOrCreateNewSession(sessionID)
	if err != nil {
		log.Println("Error While Creating Doc In Redis", err)
	}
	session.AddClientToSession(sessionID, client)

	go handleClientMessages(sessionID, client)

}

func handleClientMessages(sessionID string, client *server.Client) {
	defer func() {
		server.GetSession(sessionID).RemoveClientFromSession(sessionID, client)
		client.Conn.Close()
	}()

	for {
		_, msg, err := client.Conn.ReadMessage()
		if err != nil {
			log.Println("Client Disconnected:", err)
			break
		}

		go document.HandleDocumentEdit(sessionID, client, msg)
	}

}
