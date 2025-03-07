document.addEventListener("DOMContentLoaded", DisplayData);

// Get values from Inputs
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const add = document.getElementById("add");
const table = document.getElementById("table");
const Data = JSON.parse(localStorage.getItem("formData")) || [];

let myChart; // Declare myChart globally so we can update it later

add.addEventListener("click", () => {
    saveToStorage();
});

// Save to Local Storage Function
function saveToStorage() {
    // Get values
    let amount2 = amount.value;
    let category2 = category.value;
    let date2 = date.value;
    if (!amount2 || !category2 || !date2) {
        alert("Please fill all fields!");
        return;
    }

    // Save to Local Storage
    Data.push([amount2, category2, date2]);
    localStorage.setItem("formData", JSON.stringify(Data));
    DisplayData();

    // Clear input fields
    amount.value = "";
    category.value = "Bills";
    date.value = "";
}

// Display Data Function
function DisplayData() {
    table.innerHTML = "<tr><th>Amount</th><th>Category</th><th>Date</th><th>Action</th></tr>";
    let categoryTotals = {}; // Store total amounts per category

    Data.forEach((item, index) => {
        let row = table.insertRow();
        row.insertCell(0).innerHTML = item[0];
        row.insertCell(1).innerHTML = item[1];
        row.insertCell(2).innerHTML = item[2];
        row.insertCell(3).innerHTML = `<button data-index="${index}" class="delete">Delete</button>`;

        // Sum up amounts per category
        let category = item[1];
        let amount = parseFloat(item[0]);
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    // Add event listener to Delete buttons
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            deleteItem(index);
        });
    });

    updateChart(categoryTotals); // Call the updateChart function
}

// Delete Function
function deleteItem(index) {
    index = parseInt(index);
    Data.splice(index, 1); // Remove the selected item
    localStorage.setItem("formData", JSON.stringify(Data));
    DisplayData(); // Refresh the table
}

// Create or Update Chart
function updateChart(categoryTotals) {
    let ctx = document.getElementById("expenseChart").getContext("2d");

    let labels = Object.keys(categoryTotals); // Categories
    let values = Object.values(categoryTotals); // Amounts

    if (myChart) myChart.destroy(); // Destroy old chart before creating a new one

    myChart = new Chart(ctx, {
        type: "bar", // Change to "pie" for a pie chart
        data: {
            labels: labels,
            datasets: [{
                label: "Total Spent per Category",
                data: values,
                backgroundColor: ["red", "blue", "green", "yellow", "orange"], // Adjust colors
            }]
        }
    });
}
