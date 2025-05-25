package redisclient

//Thread Safe , Doesn't require Mutex
//Persistent after Restarts
//Go Struct Memory is local , Incase of multiuple instance all can access Redis
//Go Struct don't have in built way to update change to client, Redis has Pub/Sub
//Horizontal scaling complex for go Struct
//Redis supports expiry , counter, sorted sets out of the box

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

var (
	Ctx           = context.Background()
	Client        *redis.Client
	redisUrl      = "amused-mosquito-18136.upstash.io:6379"
	redisPassword = "AUbYAAIjcDEwMTJlNjZiMTNlOTk0OGVlYTY0NDMzNmQ5MTNjYTRmYnAxMA"
)

func Init() {
	Client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		//Password:  redisPassword,
		//DB:        0,             //use default DB , change no. if using multi DB setup
		//TLSConfig: &tls.Config{}, //specifies to use tls https
	})
	pong, err := Client.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	fmt.Println("Redis connected:", pong)
}
