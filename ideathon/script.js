let chart = null;

function addRow() {

    const container = document.getElementById("productContainer");

    const row = document.createElement("div");
    row.className = "product-row";

    row.innerHTML = `
        <input type="text" placeholder="Product Name" class="name">
        <input type="number" placeholder="Cost Price" class="cost">
        <input type="number" placeholder="Selling Price" class="price">
        <input type="number" placeholder="Quantity Sold" class="qty">
        <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
    `;

    container.appendChild(row);
}

function deleteRow(button) {
    button.parentElement.remove();
}

function analyze() {

    const expenses = parseFloat(document.getElementById("expenses").value);
    if (isNaN(expenses)) {
        alert("Enter monthly expenses.");
        return;
    }

    const rows = document.querySelectorAll(".product-row");
    if (rows.length === 0) {
        alert("Add at least one product.");
        return;
    }

    let resultsHTML = "<h3>AI Product Analysis</h3>";
    let labels = [];
    let profits = [];

    rows.forEach(row => {

        const name = row.querySelector(".name").value;
        const cost = parseFloat(row.querySelector(".cost").value);
        const price = parseFloat(row.querySelector(".price").value);
        const qty = parseFloat(row.querySelector(".qty").value);

        if (!name || isNaN(cost) || isNaN(price) || isNaN(qty)) return;

        const revenue = price * qty;
        const costTotal = cost * qty;
        const profit = revenue - costTotal;
        const margin = ((profit / revenue) * 100).toFixed(2);

        // AI Pricing Suggestion
        let recommendation = "";
        let suggestedPrice = price;

        if (margin < 15) {
            suggestedPrice = (cost * 1.25).toFixed(2);
            recommendation = `Increase price to ₹${suggestedPrice}`;
        } 
        else if (margin > 40) {
            recommendation = "Strong margin. Competitive pricing possible.";
        } 
        else {
            recommendation = "Maintain current price.";
        }

        // Break-even units
        const contribution = price - cost;
        const breakEven = contribution > 0 ? Math.ceil(expenses / contribution) : 0;

        labels.push(name);
        profits.push(profit);

        resultsHTML += `
            <hr>
            <p><strong>${name}</strong></p>
            <p>Profit: ₹${profit.toFixed(2)}</p>
            <p>Margin: ${margin}%</p>
            <p>Break-Even Units: ${breakEven}</p>
            <p>AI Suggestion: ${recommendation}</p>
        `;
    });

    // Ranking
    const ranked = labels.map((name, i) => ({
        name: name,
        profit: profits[i]
    })).sort((a, b) => b.profit - a.profit);

    resultsHTML += "<hr><h3>Product Ranking</h3>";

    ranked.forEach((item, index) => {
        resultsHTML += `<p>#${index + 1} - ${item.name} (₹${item.profit.toFixed(2)})</p>`;
    });

    document.getElementById("result").innerHTML = resultsHTML;

    const ctx = document.getElementById("profitChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Profit Per Product",
                data: profits
            }]
        }
    });
}
