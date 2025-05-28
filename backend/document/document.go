package document

import (
	"encoding/json"
	"log"
	"strings"

	"github.com/c1te/collab/backend/redisclient"
	"github.com/c1te/collab/backend/server"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

// Capitalize Struct Name are exported and accessible from other package
// Lowercase Struct Name are unexported and only accessible within same package
//Same for the Capitalized and LowerCase Function name

//Use WriteJson when sending Go struct, map or any complex object. Go Marshals It into JSON
//Use WriteMessage when sending raw data like json or text

type Edit struct {
	Action   string `json:"action"`
	Text     string `json:"text"`
	Position int    `json:"position"`
	Length   int    `json:"length"`
}

func HandleDocumentEdit(sessionID string, client *server.Client, editMsg []byte) error {
	var edit Edit
	if err := json.Unmarshal(editMsg, &edit); err != nil {
		log.Println("Error Unmarshalling edit:", err)
		return err
	}
	doc, err := redisclient.Client.Get(redisclient.Ctx, sessionID).Result()

	if err == redis.Nil {
		log.Printf("Session Does Not Exist, initializing new document")
		doc = ""
	} else if err != nil {
		log.Println("Redis GET error:", err)
		return err
	}
	action := strings.TrimSpace(strings.ToLower(edit.Action))
	log.Printf(edit.Text)
	switch action {
	case "insert":
		if edit.Position >= 0 && edit.Position <= len(doc) {
			doc = doc[:edit.Position] + edit.Text + doc[edit.Position:]
		}
	case "delete":
		if edit.Position >= 0 && edit.Position+edit.Length <= len(doc) {
			doc = doc[:edit.Position] + doc[edit.Position+edit.Length:]
		}
	case "replace":
		if edit.Position >= 0 && edit.Position+edit.Length <= len(doc) {
			doc = doc[:edit.Position] + edit.Text + doc[edit.Position+edit.Length:]
		}
	case "sync":
		fullDoc, err := GetDocument(sessionID)
		if err != nil {
			log.Println("Error fetching document during sync:", err)
			return err
		}
		syncMsg := Edit{Action: "sync", Text: fullDoc}
		syncData, _ := json.Marshal(syncMsg)
		BroadCastClient(sessionID, client, syncData)
		return nil
	default:
		log.Println("Unknown Action:", edit.Action)
		return nil
	}
	if err := redisclient.Client.Set(redisclient.Ctx, sessionID, doc, 0).Err(); err != nil {
		log.Println("Error Saving Document To Redis:", err)
	}

	BroadCastClients(sessionID, client, editMsg)

	return nil
}

func GetDocument(sessionID string) (string, error) {
	doc, err := redisclient.Client.Get(redisclient.Ctx, sessionID).Result()
	if err == redis.Nil {
		return "", nil
	} else if err != nil {
		return "", err
	}
	return doc, nil
}

func BroadCastClients(sessionID string, client *server.Client, message []byte) {

	sendMsg := func(c *server.Client) {
		c.Mu.Lock()
		defer c.Mu.Unlock()

		if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println("Broadcast error:", err)
			c.Conn.Close()
			server.GetSession(sessionID).RemoveClientFromSession(sessionID, c)
		}
	}

	s := server.GetSession(sessionID)

	if s != nil {
		for _, c := range s.Clients {
			if c == nil || c.Conn == nil || c == client {
				continue
			}
			sendMsg(c)
		}
	}
}

func BroadCastClient(sessionID string, client *server.Client, message []byte) {
	client.Mu.Lock()
	defer client.Mu.Unlock()

	if err := client.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
		log.Println("Broadcast error:", err)
		client.Conn.Close()
		server.GetSession(sessionID).RemoveClientFromSession(sessionID, client)
	}
}
