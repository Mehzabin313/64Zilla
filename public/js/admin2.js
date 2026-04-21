/*const BASE_URL = "https://six4zilla.onrender.com";

// ================= LOGIN CHECK =================
if (!localStorage.getItem("admin")) {
  const pass = prompt("Enter Admin Password:");
  if (pass === "admin123") {
    localStorage.setItem("admin", "true");
  } else {
    alert("Wrong password");
    window.location.href = "/";
  }
}

// ================= SECTION SWITCH =================
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("admin");
  location.reload();
}

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  const products = await res.json();

  document.getElementById("totalProducts").innerText = products.length;

  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {

    list.innerHTML += `
      <div class="card">
        <img src="${BASE_URL}/uploads/${p.image}" width="100">
        <h4>${p.name}</h4>
        <p>${p.district}</p>
        <p>৳ ${p.price}</p>

        <button onclick="deleteProduct('${p._id}')">Delete</button>
      </div>
    `;
  });
}

// ================= DELETE PRODUCT =================
async function deleteProduct(id) {
  await fetch(`${BASE_URL}/delete-product/${id}`, {
    method: "DELETE"
  });

  alert("Deleted!");
  loadProducts();
}

// ================= LOAD ORDERS =================
async function loadOrders() {
  const res = await fetch(`${BASE_URL}/orders`);
  const orders = await res.json();

  document.getElementById("totalOrders").innerText = orders.length;

  const list = document.getElementById("orderList");
  list.innerHTML = "";

  orders.forEach(o => {

    list.innerHTML += `
      <div class="card">
        <h4>Customer: ${o.customer}</h4>
        <p>Total: ৳ ${o.total}</p>
        <p>Status: ${o.status}</p>
      </div>
    `;
  });
}

// ================= INIT =================
loadProducts();
loadOrders();
showSection("dashboard");
//--
const BASE_URL = "https://six4zilla.onrender.com";

// 🔐 protect
if (localStorage.getItem("userRole") !== "admin") {
  window.location.href = "admin.html";
}

// ================= SWITCH =================
function show(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// ================= DASHBOARD =================
async function loadDashboard() {
  const users = await fetch(`${BASE_URL}/users`).then(r => r.json());
  const sellers = await fetch(`${BASE_URL}/sellers`).then(r => r.json());
  const products = await fetch(`${BASE_URL}/products`).then(r => r.json());
  const orders = await fetch(`${BASE_URL}/orders`).then(r => r.json());

  document.getElementById("totalUsers").innerText = users.length;
  document.getElementById("totalSellers").innerText = sellers.length;
  document.getElementById("totalProducts").innerText = products.length;
  document.getElementById("totalOrders").innerText = orders.length;
}

// ================= USERS =================
async function loadUsers() {
  const users = await fetch(`${BASE_URL}/users`).then(r => r.json());

  const list = document.getElementById("userList");
  list.innerHTML = "";

  users.forEach(u => {
    list.innerHTML += `
      <div class="card">
        ${u.email}
        <button onclick="deleteUser('${u._id}')">Delete</button>
      </div>
    `;
  });
}

async function deleteUser(id) {
  await fetch(`${BASE_URL}/delete-user/${id}`, { method: "DELETE" });
  loadUsers();
}

// ================= SELLERS =================
async function loadSellers() {
  const sellers = await fetch(`${BASE_URL}/sellers`).then(r => r.json());

  const list = document.getElementById("sellerList");
  list.innerHTML = "";

  sellers.forEach(s => {
    list.innerHTML += `
      <div class="card">
        ${s.email}
      </div>
    `;
  });
}

// ================= PRODUCTS =================
async function loadProducts() {
  const products = await fetch(`${BASE_URL}/products`).then(r => r.json());

  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <div class="card">
        <img src="${BASE_URL}/uploads/${p.image}" width="80">
        ${p.name} - ৳${p.price}
        <button onclick="deleteProduct('${p._id}')">Delete</button>
      </div>
    `;
  });
}

async function deleteProduct(id) {
  await fetch(`${BASE_URL}/delete-product/${id}`, { method: "DELETE" });
  loadProducts();
}

// ================= ORDERS =================
async function loadOrders() {
  const orders = await fetch(`${BASE_URL}/orders`).then(r => r.json());

  const list = document.getElementById("orderList");
  list.innerHTML = "";

  orders.forEach(o => {
    list.innerHTML += `
      <div class="card">
        ${o.customer} - ৳${o.total}
        <select onchange="updateStatus('${o._id}', this.value)">
          <option ${o.status === "pending" ? "selected" : ""}>pending</option>
          <option ${o.status === "shipped" ? "selected" : ""}>shipped</option>
          <option ${o.status === "delivered" ? "selected" : ""}>delivered</option>
        </select>
      </div>
    `;
  });
}

async function updateStatus(id, status) {
  await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

// ================= INIT =================
loadDashboard();
loadUsers();
loadSellers();
loadProducts();
loadOrders();*/

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