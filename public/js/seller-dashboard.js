const sellerId = localStorage.getItem("sellerId");
const BASE_URL = "https://six4zilla.onrender.com";

// =======================
// NAVIGATION
// =======================
const addBtn = document.getElementById("addProductBtn");

if (addBtn) {
    addBtn.onclick = () => {
        window.location.href = "add-product.html";
    };
}

// =======================
// IMAGE HANDLER
// =======================
function getImage(p) {
    if (!p?.image) return "https://via.placeholder.com/50";

    if (p.image.startsWith("http")) {
        return p.image; // Cloudinary
    }

    return `${BASE_URL}/uploads/${p.image}`;
}

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {
    try {
        if (!sellerId) {
            alert("Seller not logged in");
            return;
        }

        const res = await fetch(`${BASE_URL}/my-products/${sellerId}`);
        const products = await res.json();

        const table = document.getElementById("productTable");
        const totalEl = document.getElementById("totalProducts");

        if (!table) return;

        if (totalEl) {
            totalEl.innerText = products.length;
        }

        table.innerHTML = "";

        products.forEach(p => {
            table.innerHTML += `
<tr>
    <td>
        <img src="${getImage(p)}" width="50"/>
    </td>
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
// EDIT PRODUCT
// =======================
function goToEdit(id) {
    window.location.href = `edit-product.html?id=${id}`;
}

// =======================
// DELETE PRODUCT
// =======================
async function deleteProduct(id) {
    try {
        const ok = confirm("Are you sure?");
        if (!ok) return;

        await fetch(`${BASE_URL}/delete-product/${id}`, {
            method: "DELETE"
        });

        loadProducts();
    } catch (err) {
        console.log("DELETE ERROR:", err);
    }
}

// =======================
// LOAD ORDERS
// =======================
async function loadOrders() {
    try {
        if (!sellerId) return;

        const res = await fetch(`${BASE_URL}/seller/orders/${sellerId}`);
        const orders = await res.json();

        const orderDiv = document.getElementById("orders");
        if (!orderDiv) return;

        orderDiv.innerHTML = "";

        if (!orders || orders.length === 0) {
            orderDiv.innerHTML = "<p>No orders yet</p>";
            return;
        }

        orders.forEach(order => {

            let itemsHTML = "";

            (order.items || []).forEach(item => {
                if (String(item.sellerId) === String(sellerId)) {
                    itemsHTML += `
                        <p>${item.name} (x${item.quantity}) - ৳ ${item.price}</p>
                    `;
                }
            });

            orderDiv.innerHTML += `
<div style="border:1px solid #ddd;padding:10px;margin:10px 0;">
    <h4>Order ID: ${order._id}</h4>

    <p><b>Name:</b> ${order.customer?.name || "N/A"}</p>
    <p><b>Phone:</b> ${order.customer?.phone || "N/A"}</p>
    <p><b>Address:</b> ${order.customer?.address || "N/A"}</p>

    ${itemsHTML}

    <p><b>Total:</b> ৳ ${order.total || 0}</p>
    <p><b>Payment:</b> ${order.paymentMethod || "-"}</p>
    <p><b>bKash:</b> ${order.bkashNumber || "N/A"}</p>
    <p><b>TXN:</b> ${order.transactionId || "N/A"}</p>
    <p><b>Status:</b> ${order.status || "pending"}</p>

    <button onclick="updateOrder('${order._id}','confirmed')">Confirm</button>
    <button onclick="updateOrder('${order._id}','shipped')">Ship</button>
    <button onclick="updateOrder('${order._id}','delivered')">Deliver</button>
</div>
`;
        });

    } catch (err) {
        console.log("ORDER ERROR:", err);
    }
}

// =======================
// UPDATE ORDER STATUS
// =======================
async function updateOrder(id, status) {
    try {
        await fetch(`${BASE_URL}/orders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });

        loadOrders();

    } catch (err) {
        console.log("UPDATE ERROR:", err);
    }
}

// =======================
// INIT
// =======================
loadProducts();
loadOrders();