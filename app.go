package main

import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
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

    // debuggerlog.Println("This is a log message.")
    log.Println(receipts)

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

    log.Printf("hello from getpoints")

    // Split path into pieces
    urlParts := strings.Split(r.URL.Path, "/")
    // Check correct structure
    if len(urlParts) < 3 {
        http.Error(w, "Invalid URL path", http.StatusBadRequest)
        return
    }
    
    // Take receipt ID
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

// Calculator for points
func calculatePoints(receipt Receipt) int {
    points := 0

    // Rule 1: One point for every alphanumeric character in the retailer name.
    points += len(regexp.MustCompile("[a-zA-Z0-9]").FindAllString(receipt.Retailer, -1))

    // Rule 2: 50 points if the total is a round dollar amount with no cents.
    total, _ := strconv.ParseFloat(receipt.Total, 64)
    if total == float64(int(total)) {
        points += 50
    }

    // Rule 3: 25 points if the total is a multiple of 0.25.
    if math.Mod(total, 0.25) == 0 {
        points += 25
    }

    // Rule 4: 5 points for every two items on the receipt.
    points += len(receipt.Items) / 2 * 5

    // Rule 5: If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    for _, item := range receipt.Items {
        trimmedLength := len(strings.TrimSpace(item.ShortDescription))
        if trimmedLength%3 == 0 {
            price, _ := strconv.ParseFloat(item.Price, 64)
            points += int(math.Ceil(price * 0.2))
        }
    }

    // Rule 6: 6 points if the day in the purchase date is odd.
    purchaseDate, _ := time.Parse("2006-01-02", receipt.PurchaseDate)
    if purchaseDate.Day()%2 != 0 {
        points += 6
    }

    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    purchaseTime, _ := time.Parse("15:04", receipt.PurchaseTime)
    if purchaseTime.After(time.Date(0, 0, 0, 14, 0, 0, 0, time.UTC)) && purchaseTime.Before(time.Date(0, 0, 0, 16, 0, 0, 0, time.UTC)) {
        points += 10
    }

    return points
}


func main() {
    http.HandleFunc("/receipts/process", ProcessReceipt)
    http.HandleFunc("/receipts/", GetPoints) // Register the GetPoints handler

    log.Fatal(http.ListenAndServe(":8080", nil))
}
