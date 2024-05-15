package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func corsMiddleware(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func buttonClickedHandler(w http.ResponseWriter, r *http.Request) {
	corsMiddleware(w, r);
	fmt.Println("Button clicked!")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Button clicked!"))
}

func main() {
	fmt.Println("Starting GO server on port 8080...")

	db := pocketbase.New()
	db.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		log.Println("Pocketbase is about to start...")
		return nil
	})

	// Start Pocketbase in a go routine to avoid blocking the main thread http listener
	go func() {
		if err := db.Start(); err != nil {
			log.Fatal(err)
		}
	}()
	http.HandleFunc("/api/button-clicked", buttonClickedHandler)
	http.ListenAndServe("localhost:8080", nil)
}
