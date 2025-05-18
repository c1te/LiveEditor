package main

import (
	"log"
	"net/http"

	"github.com/c1te/collab/backend/redisclient"
	"github.com/c1te/collab/backend/ws"
)

func main() {
	//initialize redis connection
	redisclient.Init()

	log.Println("Starting Collaorative editor backend on:8080")
	//Route handler for /ws
	http.HandleFunc("/ws", ws.HandleWebSocket)
	//Start http server on port 8080 and Error handling
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Server Failed", err)
	}
}
