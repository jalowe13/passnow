package main

import (
	"fmt"
	"log"
	"os"
	"time"
	"net/http"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/models"
    "github.com/pocketbase/pocketbase/models/schema"
    "github.com/pocketbase/pocketbase/tools/types"
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
	// serves static files from the provided public dir (if exists)
	db.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		return nil
	})
	fmt.Println("Pocketbase before serve event added...")
	// Start Pocketbase in a go routine to avoid blocking the main thread http listener
	go func() {
		if err := db.Start(); err != nil {
			log.Fatal(err)
		}
	}()
	time.Sleep(time.Second * 5) // Wait for 5 seconds to allow Pocketbase to start
	fmt.Println("Pocketbase started!!!!!!!!!!!!!!!!!!!")

	// Create a new collection, must go into a function
	collection := &models.Collection{
		Name:       "Rubys iaejwfaioj",
		Type:       models.CollectionTypeBase,
		ListRule:   nil,
		ViewRule:   types.Pointer("@request.auth.id != ''"),
		CreateRule: types.Pointer(""),
		UpdateRule: types.Pointer("@request.auth.id != ''"),
		DeleteRule: nil,
		Schema:     schema.NewSchema(
			&schema.SchemaField{
				Name:     "name",
				Type:     schema.FieldTypeText,
				Required: true,
				Options:  &schema.TextOptions{
					Max: types.Pointer(10),
				},
			},
			&schema.SchemaField{
				Name:     "password",
				Type:     schema.FieldTypeText,
				Required: true,
				Options:  &schema.TextOptions{
					Max: types.Pointer(20), // Password max length
				},
			},
		),
		Indexes: types.JsonArray[string]{
			"CREATE UNIQUE INDEX idx_name ON example (name)",
		},
	}
	
	if err := db.Dao().SaveCollection(collection); err == nil {
		fmt.Println("Collection Not Saved"); 
	}


	log.Println("Record saved successfully!")
	http.HandleFunc("/api/button-clicked", buttonClickedHandler)
	http.ListenAndServe("localhost:8080", nil)

}
