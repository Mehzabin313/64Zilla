
// =======================
/*const sellerId = localStorage.getItem("sellerId");
const BASE_URL = "https://six4zilla.onrender.com";
// =======================
// ELEMENTS
// =======================
const addBtn = document.getElementById("addProductBtn");

// =======================
// NAVIGATION
// =======================
if (addBtn) {
    addBtn.onclick = () => {
        window.location.href = "add-product.html";
    };
}

async function loadProducts() {
    try {
        if (!sellerId) {
            console.log("❌ sellerId not found");
            return;
        }

        const res = await fetch(`${BASE_URL}/my-products/${sellerId}`);
        const products = await res.json();

        const totalEl = document.getElementById("totalProducts");
        const table = document.getElementById("productTable");

        if (!table) return;

        totalEl.innerText = products.length;
        table.innerHTML = "";

        products.forEach(p => {
            table.innerHTML += `
<tr>
    <td> <img src="${p.image}" width="50" /></td>
    <td>${p.name}</td>
    <td>${p.district || "-"}</td>
    <td>${p.size || "-"}</td>
    <td>৳ ${p.price}</td>
    <td>
        <button onclick="goToEdit('${p._id}')">Edit</button>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
    </td>
</tr>
`;
        });

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }
}

// =======================
// EDIT NAVIGATION
// =======================
function goToEdit(id) {
    window.location.href = `edit-product.html?id=${id}`;
}

// =======================
// DELETE PRODUCT
// =======================
async function deleteProduct(id) {

    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`${BASE_URL}/delete-product/${id}`, {
        method: "DELETE"
    });

    loadProducts();
}


async function loadOrders() {
  try {

    if (!sellerId) return;

    const res = await fetch(`${BASE_URL}/seller/orders/${sellerId}`);
    const orders = await res.json();

    const orderDiv = document.getElementById("orders");
      const totalOrderEl = document.getElementById("totalorder");
        const totalSaleEl = document.getElementById("totalsale");
    if (!orderDiv) return;

    orderDiv.innerHTML = "";

    if (orders.length === 0) {
      orderDiv.innerHTML = "<p>No orders yet</p>";
      return;
    }

    orders.forEach(order => {

      let itemsHTML = "";

      order.items.forEach(item => {
        if (String(item.sellerId) === String(sellerId)) {
          itemsHTML += `
            <p>${item.name} (x${item.quantity}) - ৳ ${item.price}</p>
          `;
        }
      });

      orderDiv.innerHTML += `
        <div style="border:1px solid #ddd; padding:10px; margin:10px 0;">
          
          <h4>Order ID: ${order._id}</h4>

           <p><b>Name:</b> ${order.customer?.name || "N/A"}</p>
          <p><b>Phone:</b> ${order.customer?.phone || "N/A"}</p>
          <p><b>Address:</b> ${order.customer?.address || "N/A"}</p>

          ${itemsHTML}

          <p><b>Total:</b> ৳ ${order.total}</p>
          <p><b>Payment Method:</b> ${order.paymentMethod}</p>
    <p><b>bKash Number:</b> ${order.bkashNumber || "N/A"}</p>
    <p><b>Transaction ID:</b> ${order.transactionId || "N/A"}</p>
    <p><b>Payment Status:</b> ${order.paymentStatus || "unpaid"}</p>
          <p><b>Status:</b> ${order.status}</p>

          <button onclick="updateOrder('${order._id}','confirmed')">Confirm</button>
          <button onclick="updateOrder('${order._id}','shipped')">Ship</button>
          <button onclick="updateOrder('${order._id}','delivered')">Deliver</button>

        </div>
      `;
    });

  } catch (err) {
    console.log(err);
  }
}

async function updateOrder(id, status) {
  await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  loadOrders();
}

// =======================
// INIT
// =======================
loadProducts();
loadOrders();*/
// =======================
// SELLER ID + BASE URL
// =======================
const sellerId = localStorage.getItem("sellerId");
const BASE_URL = "https://six4zilla.onrender.com";

// =======================
// ELEMENTS
// =======================
const addBtn = document.getElementById("addProductBtn");

// =======================
// NAVIGATION
// =======================
if (addBtn) {
    addBtn.onclick = () => {
        window.location.href = "add-product.html";
    };
}

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {
    try {
        if (!sellerId) {
            console.log("sellerId not found");
            return;
        }

        const res = await fetch(`${BASE_URL}/my-products/${sellerId}`);
        const products = await res.json();

        const totalEl = document.getElementById("totalProducts");
        const table = document.getElementById("productTable");

        if (!table) return;

        totalEl.innerText = products.length;
        table.innerHTML = "";

        products.forEach(p => {
            table.innerHTML += `
<tr>
    <td><img src="${p.image}" width="50"></td>
    <td>${p.name}</td>
    <td>${p.district || "-"}</td>
    <td>${p.size || "-"}</td>
    <td>৳ ${p.price}</td>
    <td>
        <button onclick="goToEdit('${p._id}')">Edit</button>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
    </td>
</tr>
`;
        });

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }
}

// =======================
// EDIT NAVIGATION
// =======================
function goToEdit(id) {
    window.location.href = `edit-product.html?id=${id}`;
}

// =======================
// DELETE PRODUCT
// =======================
async function deleteProduct(id) {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`${BASE_URL}/delete-product/${id}`, {
        method: "DELETE"
    });

    loadProducts();
}

// =======================
// LOAD ORDERS + COUNT + TOTAL
// =======================
async function loadOrders() {
    try {
        if (!sellerId) return;

        const res = await fetch(`${BASE_URL}/seller/orders/${sellerId}`);
        const orders = await res.json();

        const orderDiv = document.getElementById("orders");
        const totalOrderEl = document.getElementById("totalorder");
        const totalSaleEl = document.getElementById("totalsale");

        if (!orderDiv) return;

        orderDiv.innerHTML = "";

        if (orders.length === 0) {
            orderDiv.innerHTML = "<p>No orders yet</p>";
            totalOrderEl.innerText = 0;
            totalSaleEl.innerText = "৳ 0";
            return;
        }

        let totalOrders = orders.length;
        let totalSales = 0;

        orders.forEach(order => {

            let itemsHTML = "";
            let sellerTotal = 0;

            order.items.forEach(item => {
                if (String(item.sellerId) === String(sellerId)) {

                    let itemTotal = item.price * item.quantity;
                    sellerTotal += itemTotal;

                    itemsHTML += `
                        <p>${item.name} (x${item.quantity}) - ৳ ${item.price}</p>
                    `;
                }
            });

            totalSales += sellerTotal;

            orderDiv.innerHTML += `
            <div style="border:1px solid #ddd; padding:10px; margin:10px 0;">
                
                <h4>Order ID: ${order._id}</h4>

                <p><b>Name:</b> ${order.customer?.name || "N/A"}</p>
                <p><b>Phone:</b> ${order.customer?.phone || "N/A"}</p>
                <p><b>Address:</b> ${order.customer?.address || "N/A"}</p>

                ${itemsHTML}

                <p><b>Your Total:</b> ৳ ${sellerTotal}</p>

                <p><b>Payment Method:</b> ${order.paymentMethod}</p>
                <p><b>Payment Status:</b> ${order.paymentStatus || "unpaid"}</p>
                <p><b>Status:</b> ${order.status}</p>

                <button onclick="updateOrder('${order._id}','confirmed')">Confirm</button>
                <button onclick="updateOrder('${order._id}','shipped')">Ship</button>
                <button onclick="updateOrder('${order._id}','delivered')">Deliver</button>

            </div>
            `;
        });

        // 🔥 SET TOP CARDS
        totalOrderEl.innerText = totalOrders;
        totalSaleEl.innerText = "৳ " + totalSales;

    } catch (err) {
        console.log("ORDER ERROR:", err);
    }
}

// =======================
// UPDATE ORDER STATUS
// =======================
async function updateOrder(id, status) {
    await fetch(`${BASE_URL}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });

    loadOrders();
}

// =======================
// INIT
// =======================
loadProducts();
loadOrders();