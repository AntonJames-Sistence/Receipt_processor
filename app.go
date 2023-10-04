package main

import (
    "encoding/json"
    "log"
    "net/http"
    // "regexp"
    "strings"
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

// Create recepts and points map
var receipts = make(map[string]Receipt)
var points = make(map[string]int)

func ProcessReceipt(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // Implement receipt processing logic here
    // Store the receipt data in the 'receipts' map
    var receipt Receipt
    err := json.NewDecoder(r.Body).Decode(&receipt)
    if err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Generate a unique receipt ID (you can use UUID or any other method)
    receiptID := "generated_receipt_id"

    receipts[receiptID] = receipt

    // Return the receipt ID in the response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"id": receiptID})
}

func GetPoints(w http.ResponseWriter, r *http.Request) {
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

    pointsAwarded, found := points[receiptID]
    if !found {
        pointsAwarded = 0
    }

    // Return the points in the response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]int{"points": pointsAwarded})
}

func main() {
    http.HandleFunc("/receipts/process", ProcessReceipt)
    http.HandleFunc("/receipts/", GetPoints)

    log.Fatal(http.ListenAndServe(":8080", nil))
}
