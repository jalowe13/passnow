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

	fmt.Println("Pocketbase created...")
	db.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		log.Println("Pocketbase is about to start...")
		fmt.Println("Pocketbase is about to start...")
		return nil
	})
	fmt.Println("Pocketbase before serve event added...")
	// Start Pocketbase in a go routine to avoid blocking the main thread http listener
	go func() {
		err := db.Start()
		if err != nil {
			log.Fatal(err)
			fmt.Println("Pocketbase failed to start!")
		} else {
			fmt.Println("Pocketbase started successfully!")
		}
	}()
	fmt.Println("Pocketbase started...")
	http.HandleFunc("/api/button-clicked", buttonClickedHandler)
	http.ListenAndServe("localhost:8080", nil)
}
