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
        const resultElement = document.getElementById("result");
        resultElement.innerHTML = `
            <span class="label">JSON data:</span> ${JSON.stringify(receiptData)}
            <br><br>
            <span class="label">Receipt ID:</span> 
            <span class="label-blue">${data.id}</span>`;
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
        const resultElement = document.getElementById("result");
        resultElement.innerHTML = `
            <span class="label">JSON data:</span> ${JSON.stringify(exampleReceipt)}
            <br><br>
            <span class="label">Receipt ID:</span> 
            <span class="label-blue">${data.id}</span>`;
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
        const resultElement = document.getElementById("result");
        resultElement.innerHTML = `
            <span class="label">JSON data:</span> ${JSON.stringify(exampleReceipt)}
            <br><br>
            <span class="label">Receipt ID:</span> 
            <span class="label-blue">${data.id}</span>`;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error occurred while processing the receipt.";
    });
});
document.getElementById("submitReceiptThreeButton").addEventListener("click", function() {
    // Example #3
    const exampleReceipt = {
        retailer: "Walgreens",
        purchaseDate: "2022-01-02",
        purchaseTime: "08:13",
        items: [
            {
                shortDescription: "Pepsi - 12-oz", 
                price: "1.25"
            },{
                shortDescription: "Dasani", 
                price: "1.40"
            }
        ],
        total: "2.65"
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
        const resultElement = document.getElementById("result");
        resultElement.innerHTML = `
            <span class="label">JSON data:</span> ${JSON.stringify(exampleReceipt)}
            <br><br>
            <span class="label">Receipt ID:</span> 
            <span class="label-blue">${data.id}</span>`;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error occurred while processing the receipt.";
    });
});

document.getElementById("getPointsButton").addEventListener("click", function() {
    const labelBlue = document.querySelector(".label-blue");
    const labelBlueText = labelBlue.textContent;

    if (labelBlueText) {
            const receiptId = labelBlueText;
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
                const resultElement = document.getElementById("result");
                resultElement.innerHTML = `
                    <span class="label-blue">Receipt points:</span>
                    ${data.points}`;
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("result").textContent = "Error occurred while fetching points.";
            });

            // Now you can use the extracted receipt ID as needed
    } else {
        const errorMessage = "Receipt ID is not found";
        window.alert(errorMessage);
    }
});

document.getElementById("all-receipts").addEventListener("click", function() {
    // Send a GET request to your Go backend to retrieve all receipts
    fetch("/receipts/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        // Display the response in the "result" div
        const resultElement = document.getElementById("result");
        resultElement.innerHTML = `
            <span class="label">All Receipts:</span> ${JSON.stringify(data)}
        `;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error occurred while fetching all receipts.";
    });
});