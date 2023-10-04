package main

import (
    "encoding/json"
    "log"
    "net/http"
    "github.com/gorilla/mux"
)

type Receipt struct {
    // Define your receipt struct based on the OpenAPI schema
    Retailer     string
    PurchaseDate string
    PurchaseTime string
    Items        []Item
    Total        string
}

type Item struct {
    // Define your item struct based on the OpenAPI schema
    ShortDescription string
    Price            string
}

var receipts = make(map[string]Receipt)
var points = make(map[string]int)

func ProcessReceipt(w http.ResponseWriter, r *http.Request) {
    // Implement receipt processing logic here
    // Store the receipt data in the 'receipts' map
    var receipt Receipt
    json.NewDecoder(r.Body).Decode(&receipt)

    // Generate a unique receipt ID (you can use UUID or any other method)
    receiptID := "generated_receipt_id"

    receipts[receiptID] = receipt

    // Return the receipt ID in the response
    json.NewEncoder(w).Encode(map[string]string{"id": receiptID})
}

func GetPoints(w http.ResponseWriter, r *http.Request) {
    // Implement logic to retrieve points for a given receipt ID
    vars := mux.Vars(r)
    receiptID := vars["id"]
    
    pointsAwarded, found := points[receiptID]
    if !found {
        pointsAwarded = 0
    }

    json.NewEncoder(w).Encode(map[string]int{"points": pointsAwarded})
}

func main() {
    router := mux.NewRouter()

    // Define API routes
    router.HandleFunc("/receipts/process", ProcessReceipt).Methods("POST")
    router.HandleFunc("/receipts/{id}/points", GetPoints).Methods("GET")

    log.Fatal(http.ListenAndServe(":8080", router))
}
