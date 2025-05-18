package redisclient

//Thread Safe , Doesn't require Mutex
//Persistent after Restarts
//Go Struct Memory is local , Incase of multiuple instance all can access Redis
//Go Struct don't have in built way to update change to client, Redis has Pub/Sub
//Horizontal scaling complex for go Struct
//Redis supports expiry , counter, sorted sets out of the box

import (
	"context"

	"github.com/redis/go-redis/v9"
)

var (
	Ctx    = context.Background()
	Client *redis.Client
)

func Init() {
	Client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
}
