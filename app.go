package main

import (
    "encoding/json"
    "log"
    "net/http"
    // "regexp"
    "strings"
    "github.com/google/uuid"
)

type Receipt struct {
    // Receipt structure based on the OpenAPI schema
    Retailer     string
    PurchaseDate string
    PurchaseTime string
    Total        string
    Items        []Item
}

type Item struct {
    // Define item structure
    ShortDescription string
    Price            string
}

// Create maps to store receipts and points
var receipts = make(map[string]Receipt)
var points = make(map[string]int)

func ProcessReceipt(w http.ResponseWriter, r *http.Request) {
    // Method checker
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // use built-in NewDecoder and Decode methods to store the receipt data in the 'receipts' map
    var receipt Receipt
    err := json.NewDecoder(r.Body).Decode(&receipt)
    if err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Generate a unique receipt ID using UUID
    receiptID := uuid.New().String()

    // Store the receipt data in the 'receipts' map
    receipts[receiptID] = receipt

    // Return the receipt ID in the response
    response := map[string]string{"id": receiptID}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func GetPoints(w http.ResponseWriter, r *http.Request) {
    // Method checker
    if r.Method != http.MethodGet {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // Extract the receipt ID from the URL path
    urlParts := strings.Split(r.URL.Path, "/")
    if len(urlParts) < 3 {
        http.Error(w, "Invalid URL path", http.StatusBadRequest)
        return
    }
    receiptID := urlParts[2]

    // Lookup the receipt by its ID
    receipt, found := receipts[receiptID]
    if !found {
        http.Error(w, "No receipt found for that ID", http.StatusNotFound)
        return
    }

    // Calculate the points based on the rules
    points := calculatePoints(receipt)

    // Return the points in the response
    response := map[string]int{"points": points}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

// func main() {
//     http.HandleFunc("/receipts/process", ProcessReceipt)
//     http.HandleFunc("/receipts/", GetPoints)

//     log.Fatal(http.ListenAndServe(":8080", nil))
// }
