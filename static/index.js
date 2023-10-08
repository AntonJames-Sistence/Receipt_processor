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

    // Collect items data and parse it into an array of objects
    const itemsInput = document.getElementById("itemsInput").value;
    const items = JSON.parse(itemsInput);

    const total = document.getElementById("totalInput").value;

    // Create a JSON object with the data
    const receiptData = {
        retailer,
        purchaseDate,
        purchaseTime,
        items, // Include the items array
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
            <span class="label">Data:</span> ${JSON.stringify(receiptData)}
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
            <span class="label">Data:</span> ${JSON.stringify(exampleReceipt)}
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
            <span class="label">Data:</span> ${JSON.stringify(exampleReceipt)}
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
            <span class="label">Data:</span> ${JSON.stringify(exampleReceipt)}
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
        const resultElement = document.getElementById("receipts");

        // Initialize an empty HTML content string
        let htmlContent = '';

        // Iterate through each item in the data array
        data.forEach(item => {
            // Add the JSON representation of the item to the HTML content
            htmlContent += `<span class="label-blue">${JSON.stringify(item.id)}</span><br>
                            ${JSON.stringify(item.receipt.Retailer)}<br>
                            ${JSON.stringify(item.receipt.PurchaseDate)}<br>
                            ${JSON.stringify(item.receipt.PurchaseTime)}<br>
                            ${JSON.stringify(item.receipt.Total)}<br>
                            ${JSON.stringify(item.receipt.Items)}<br>
                            <br>`;
        });

        // Set the HTML content to the result element
        resultElement.innerHTML = htmlContent;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error occurred while fetching all receipts.";
    });
});

document.getElementById("search-button").addEventListener("click", function() {
    searchReceiptById();
});

function searchReceiptById() {
    // Get the input value (ID) from the search input
    const searchInput = document.getElementById("search").value;

    if (searchInput) {
        // Send a GET request to retrieve all receipts
        fetch("/receipts/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            // Find the receipt with the matching ID in the retrieved data
            const matchingReceipt = data.find(item => item.id === searchInput);

            if (matchingReceipt) {
                // Display the matching receipt data
                const resultElement = document.getElementById("result");
                resultElement.innerHTML = `
                    <span class="label">Data:</span> ${JSON.stringify(matchingReceipt.receipt)}
                    <br><br>
                    <span class="label">Receipt ID:</span> 
                    <span class="label-blue">${searchInput}</span>`;
            } else {
                // If no matching receipt is found, display an error message
                resultElement.textContent = "Receipt not found.";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("result").textContent = "Error occurred while fetching the receipts.";
        });
    } else {
        // If the search input is empty, display a message
        const resultElement = document.getElementById("result");
        resultElement.textContent = "Please enter a valid receipt ID.";
    }
};