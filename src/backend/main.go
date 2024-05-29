package main
// main.go
// Jacob Lowe
// Passnow backend server

import (
	"fmt"
	"log"
	"os"
	"time"
	"net/http"
	"encoding/json"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/models"
    "github.com/pocketbase/pocketbase/models/schema"
    "github.com/pocketbase/pocketbase/tools/types"
	"github.com/pocketbase/pocketbase/core"
)
/*
// Cross Origin Resource Sharing (CORS) middleware
	Information can be requested from another domain
*/
func corsMiddleware(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
}

// Default handler with response message
func handleRequest(w http.ResponseWriter, r *http.Request, m string){
    corsMiddleware(w, r)
    if r.Method != http.MethodOptions {
        fmt.Println(m)
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(m))		
    }
} 

// Button click handlers

func buttonClickedSave(db *pocketbase.PocketBase) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        handleRequest(w, r, "Save password!")
    }
}


func buttonClickedHandler(db *pocketbase.PocketBase) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        handleRequest(w, r, "Button clicked!")
		// TODO - Add code to save a test password to the database
    }
}

func buttonClickedGenerate(db *pocketbase.PocketBase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		corsMiddleware(w, r)
		var data struct {
			PasswordLength int `json:"passwordLength"`
			CharToggle bool `json:"charToggle"`
		}
		// Parse the request body
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Generate a password
		handleRequest(w, r, GenPass(data.PasswordLength, data.CharToggle))
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
	http.HandleFunc("/api/save" ,buttonClickedSave(db))
	http.HandleFunc("/api/set" ,buttonClickedHandler(db))
	http.HandleFunc("/api/generate-password" ,buttonClickedGenerate(db))
	http.ListenAndServe("localhost:8080", nil)

}
