
const BASE = "https://six4zilla.onrender.com";

// ================= LOAD DASHBOARD =================
document.addEventListener("DOMContentLoaded", () => {
    loadStats();
    loadSection("orders");
});

// ================= STATS =================
async function loadStats() {
    const users = await fetch(BASE + "/users").then(r => r.json()).catch(()=>[]);
    const sellers = await fetch(BASE + "/sellers").then(r => r.json()).catch(()=>[]);
    const products = await fetch(BASE + "/products").then(r => r.json()).catch(()=>[]);
    const orders = await fetch(BASE + "/orders").then(r => r.json()).catch(()=>[]);

    document.getElementById("totalUsers").innerText = users.length;
    document.getElementById("totalSellers").innerText = sellers.length;
    document.getElementById("totalProducts").innerText = products.length;
    document.getElementById("totalOrders").innerText = orders.length;

    drawChart(orders);
}

// ================= SECTION LOADER =================
async function loadSection(type) {

    const container = document.getElementById("content");
    container.innerHTML = "Loading...";

    let data = [];

    if (type === "users") {
        data = await fetch(BASE + "/users").then(r => r.json());
        container.innerHTML = renderTable(data, ["email","role"]);
    }

    if (type === "sellers") {
        data = await fetch(BASE + "/sellers").then(r => r.json());
        container.innerHTML = renderTable(data, ["username","email","district","productCategory"]);
    }

    if (type === "products") {
        data = await fetch(BASE + "/products").then(r => r.json());
        container.innerHTML = renderTable(data, ["name","price","district","size"]);
    }

    if (type === "orders") {
        data = await fetch(BASE + "/orders").then(r => r.json());
        container.innerHTML = renderOrders(data);
    }
}

// ================= TABLE RENDER =================
function renderTable(data, fields) {

    let html = `<table border="1" width="100%">
        <tr>${fields.map(f => `<th>${f}</th>`).join("")}</tr>
    `;

    data.forEach(item => {
        html += `<tr>
            ${fields.map(f => `<td>${item[f] || "-"}</td>`).join("")}
        </tr>`;
    });

    html += "</table>";
    return html;
}

// ================= ORDERS RENDER =================
function renderOrders(data) {

    let html = `<table border="1" width="100%">
        <tr>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
        </tr>
    `;

    data.forEach(o => {
        html += `
        <tr>
            <td>${o.customer?.name || "N/A"}</td>
            <td>${o.total}</td>
            <td>${o.status}</td>
        </tr>`;
    });

    html += "</table>";
    return html;
}

// ================= CHART =================
function drawChart(orders) {

    const ctx = document.getElementById("chart");

    const labels = orders.map((_,i)=>"O"+i);
    const values = orders.map(o => o.total || 0);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Orders",
                data: values
            }]
        }
    });
}