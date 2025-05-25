package redisclient

//Thread Safe , Doesn't require Mutex
//Persistent after Restarts
//Go Struct Memory is local , Incase of multiuple instance all can access Redis
//Go Struct don't have in built way to update change to client, Redis has Pub/Sub
//Horizontal scaling complex for go Struct
//Redis supports expiry , counter, sorted sets out of the box

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var (
	Ctx           = context.Background()
	Client        *redis.Client
	redisUrl      = os.Getenv("DB_URL")
	redisPassword = os.Getenv("DB_PASS")
)

func Init() {
	Client = redis.NewClient(&redis.Options{
		Addr:      redisUrl,
		Password:  redisPassword,
		DB:        0,             //use default DB , change no. if using multi DB setup
		TLSConfig: &tls.Config{}, //specifies to use tls https
	})
	pong, err := Client.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	fmt.Println("Redis connected:", pong)
}
