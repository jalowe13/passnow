package main
// Jacob Lowe
import (
	"fmt"
	"net/http"
)
/* Imports for later use in pocketbase
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
*/

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
	http.HandleFunc("/api/button-clicked", buttonClickedHandler)
	http.ListenAndServe("localhost:8080", nil)
}
