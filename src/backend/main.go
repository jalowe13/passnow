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

func buttonClickedHandler(db *pocketbase.PocketBase) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        corsMiddleware(w, r)
        fmt.Println("Button clicked!")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("Button clicked!"))

		// TODO - Add code to save a test password to the database
    }
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

	// Create a new passwords collection, must go into a function
	collection := &models.Collection{
		Name:       "Passwords",
		Type:       models.CollectionTypeBase,
		ListRule:   nil,
		ViewRule:   types.Pointer("@request.auth.id != ''"),
		CreateRule: types.Pointer(""),
		UpdateRule: types.Pointer("@request.auth.id != ''"),
		DeleteRule: nil,
		Schema:     schema.NewSchema(
			&schema.SchemaField{
				Name:     "userID",
				Type:     schema.FieldTypeText,
				Required: true,
			},
			&schema.SchemaField{
				Name:     "website",
				Type:     schema.FieldTypeText,
				Required: true,
			},
			&schema.SchemaField{
				Name:     "username",
				Type:     schema.FieldTypeText,
				Required: true,
				Options:  &schema.TextOptions{
					Max: types.Pointer(50), // Username max length
				},
			},
			&schema.SchemaField{
				Name:     "password",
				Type:     schema.FieldTypeText,
				Required: true,            
				Options:  &schema.TextOptions{
					Max: types.Pointer(50), // Password max length
				},
			},
		),
		Indexes: types.JsonArray[string]{
			"CREATE UNIQUE INDEX idx_userID_website ON Passwords (userID, website)",
		},
	}
	
	if err := db.Dao().SaveCollection(collection); err == nil {
		fmt.Println("Collection Not Saved"); 
	}


	log.Println("Record saved successfully!")
	http.HandleFunc("/api/button-clicked", buttonClickedHandler(db))
	http.ListenAndServe("localhost:8080", nil)

}
