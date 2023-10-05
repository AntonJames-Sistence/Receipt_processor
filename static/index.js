function formatTime(inputTime) {
    const time = new Date(`1970-01-01T${inputTime}`);
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

document.getElementById("submitCustomReceiptButton").addEventListener("click", function() {
    // Collect data from form fields
    const retailer = document.getElementById("retailerInput").value;
    const purchaseDate = document.getElementById("purchaseDateInput").value;

    // Convert the time input to the desired format (HH:MM)
    const purchaseTimeInput = document.getElementById("purchaseTimeInput").value;
    const purchaseTime = formatTime(purchaseTimeInput);
    
    const items = document.getElementById("itemsInput").value;
    const total = document.getElementById("totalInput").value;

    // Create a JSON object with the data
    const receiptData = {
        retailer,
        purchaseDate,
        purchaseTime,
        items: [
            { shortDescription: "Gatorade", price: "2.25" },
            { shortDescription: "Gatorade", price: "2.25" },
            { shortDescription: "Gatorade", price: "2.25" },
            { shortDescription: "Gatorade", price: "2.25" }
        ],
        total
    };

    // Send a POST request to your Go backend
    fetch("/receipts/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(receiptData)
    })
    .then(response => response.json())
    .then(data => {
        // Display the response in the "result" div
        document.getElementById("result").textContent = `Receipt ID: ${data.id}`;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error occurred while processing the receipt.";
    });
});

document.getElementById("submitReceiptOneButton").addEventListener("click", function() {
    // Example receipt data
    const exampleReceipt = {
        retailer: "M&M Corner Market",
        purchaseDate: "2022-03-20",
        purchaseTime: "14:33",
        items: [
            { shortDescription: "Gatorade", price: "2.25" },
            { shortDescription: "Gatorade", price: "2.25" },
            { shortDescription: "Gatorade", price: "2.25" },
            { shortDescription: "Gatorade", price: "2.25" }
        ],
        total: "9.00"
    };

    // Send a POST request to your Go backend with the example data
    fetch("/receipts/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(exampleReceipt)
    })
    .then(response => response.json())
    .then(data => {
        // Display the response in the "result" div
        document.getElementById("result").textContent = `Receipt ID: ${data.id}`;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error occurred while processing the receipt.";
    });
});

document.getElementById("submitReceiptTwoButton").addEventListener("click", function() {
    // Example #2
    const exampleReceipt = {
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [
            {
                shortDescription: "Mountain Dew 12PK",
                price: "6.49"
            },{
                shortDescription: "Emils Cheese Pizza",
                price: "12.25"
            },{
                shortDescription: "Knorr Creamy Chicken",
                price: "1.26"
            },{
                shortDescription: "Doritos Nacho Cheese",
                price: "3.35"
            },{
                shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
                price: "12.00"
            }
        ],
        total: "35.35"
    };

    fetch("/receipts/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(exampleReceipt)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").textContent = `Receipt ID: ${data.id}`;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error occurred while processing the receipt.";
    });
});


document.getElementById("getPointsButton").addEventListener("click", function() {
    // Assuming the text content of the div looks like "Receipt ID: 5a2a02c0-457e-4356-ac64-d7ba8dcd6f8a"
    const divText = document.getElementById("result").textContent;

    // Use a regular expression to extract the receipt ID
    const regex = /Receipt ID: (\S+)/;
    const match = divText.match(regex);

    if (match) {
        // The captured ID is in match[1]
        const receiptId = match[1];
        // Send a GET request to your Go backend to retrieve points
        fetch(`/receipts/${receiptId}/points`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            // Display the points in the "result" div
            document.getElementById("result").textContent = `Points: ${data.points}`;
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("result").textContent = "Error occurred while fetching points.";
        });

        // Now you can use the extracted receipt ID as needed
    } else {
        console.error("Receipt ID not found in the div text.");
    }
});
