/*const sellerId = localStorage.getItem("sellerId");

// =======================
// ELEMENTS
// =======================
const addBtn = document.getElementById("addProductBtn");
const addSection = document.getElementById("addProductSection");
const form = document.getElementById("addProductForm");

// =======================
// TOGGLE ADD PRODUCT
// =======================
addBtn.onclick = () => {
    addSection.style.display =
        addSection.style.display === "none" ? "block" : "none";
};

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {

    const res = await fetch(`http://localhost:3000/my-products/${sellerId}`);
    const products = await res.json();

    document.getElementById("totalProducts").innerText = products.length;

    const table = document.getElementById("productTable");
    table.innerHTML = "";

    products.forEach(p => {

        table.innerHTML += `
        <tr>
            <td>
                <img src="http://localhost:3000/uploads/${p.image}" width="50">
            </td>
            <td>${p.name}</td>
            <td>${p.district || "-"}</td>
            <td>৳ ${p.price}</td>
            <td>
                <button onclick="deleteProduct('${p._id}')">Delete</button>
            </td>
        </tr>
        `;
    });
}

loadProducts();

// =======================
// ADD PRODUCT (MULTER)
// =======================
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("sellerId", sellerId);
    formData.append("name", document.getElementById("name").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("district", document.getElementById("district").value);
    formData.append("size", document.getElementById("size").value);
    formData.append("availability", document.getElementById("availability").value);

    const file = document.getElementById("image").files[0];
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/add-product", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (data.success) {
        alert("Product Added Successfully!");
        form.reset();
        addSection.style.display = "none";
        loadProducts();
    } else {
        alert("Error adding product");
    }
});

// =======================
// DELETE PRODUCT
// =======================
async function deleteProduct(id) {
    await fetch(`http://localhost:3000/delete-product/${id}`, {
        method: 'DELETE'
    });

    loadProducts();
}

// =======================
// CHART (UNCHANGED)
// =======================
const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Sales',
            data: [5000, 8000, 6000, 10000, 9000],
            borderWidth: 2
        }]
    }
});
//---//
const sellerId = localStorage.getItem("sellerId");

// =======================
// ELEMENTS
// =======================
const addBtn = document.getElementById("addProductBtn");
const addSection = document.getElementById("addProductSection");
const form = document.getElementById("addProductForm");

// =======================
// NAVIGATION (FIXED)
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
        if (!sellerId) return;

        const res = await fetch(`http://localhost:3000/my-products/${sellerId}`);
        const products = await res.json();

        document.getElementById("totalProducts").innerText = products.length;

        const table = document.getElementById("productTable");
        table.innerHTML = "";

        products.forEach(p => {
            table.innerHTML += `
            <tr>
                <td>
                    <img src="http://localhost:3000/uploads/${p.image}" width="50">
                </td>
                <td>${p.name}</td>
                <td>${p.district || "-"}</td>
                <td>৳ ${p.price}</td>
                <td>
                    <button onclick="deleteProduct('${p._id}')">Delete</button>
                </td>
            </tr>
            `;
        });

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }
}

// initial load
loadProducts();


// =======================
// ADD PRODUCT (ONLY IF THIS FORM EXISTS HERE)
// =======================
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("sellerId", sellerId);
        formData.append("name", document.getElementById("name").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("district", document.getElementById("district").value);
        formData.append("size", document.getElementById("size").value);
        formData.append("availability", document.getElementById("availability").value);

        const file = document.getElementById("image").files[0];
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:3000/add-product", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                alert("Product Added Successfully!");

                form.reset();

                // 🔥 IMPORTANT FIX: refresh dashboard data
                loadProducts();
            } else {
                alert("Error adding product");
            }

        } catch (err) {
            console.log("ADD ERROR:", err);
        }
    });
}


// =======================
// DELETE PRODUCT
// =======================
async function deleteProduct(id) {
    try {
        await fetch(`http://localhost:3000/delete-product/${id}`, {
            method: 'DELETE'
        });

        loadProducts(); // refresh after delete
    } catch (err) {
        console.log("DELETE ERROR:", err);
    }
}


// =======================
// CHART (UNCHANGED)
// =======================
const ctx = document.getElementById('myChart');

if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Sales',
                data: [5000, 8000, 6000, 10000, 9000],
                borderWidth: 2
            }]
        }
    });
}
    //
const sellerId = localStorage.getItem("sellerId");

// =======================
// ELEMENTS
// =======================
const addBtn = document.getElementById("addProductBtn");
const addSection = document.getElementById("addProductSection");
const form = document.getElementById("addProductForm");

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
            console.log("❌ sellerId not found");
            return;
        }

        console.log("✅ sellerId:", sellerId);

        const res = await fetch(`http://localhost:3000/my-products/${sellerId}`);
        const products = await res.json();

        console.log("📦 products:", products);

        const totalEl = document.getElementById("totalProducts");
        const table = document.getElementById("productTable");

        if (!table) return;

        totalEl.innerText = products.length;
        table.innerHTML = "";

        products.forEach(p => {
            table.innerHTML += `
            <tr>
                <td>
                    <img src="http://localhost:3000/uploads/${p.image}" width="50">
                </td>
                <td>${p.name}</td>
                <td>${p.district || "-"}</td>
                <td>৳ ${p.price}</td>
                <td>
                    <button onclick="deleteProduct('${p._id}')">Delete</button>
                </td>
            </tr>
            `;
        });

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }
}

// initial load
loadProducts();


// =======================
// ADD PRODUCT
// =======================
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("sellerId", sellerId);
        formData.append("name", document.getElementById("name").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("district", document.getElementById("district").value);
        formData.append("size", document.getElementById("size").value);
        formData.append("availability", document.getElementById("availability").value);

        const file = document.getElementById("image").files[0];
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:3000/add-product", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                alert("Product Added Successfully!");
                form.reset();

                // refresh
                loadProducts();

            } else {
                alert("Error adding product");
            }

        } catch (err) {
            console.log("ADD ERROR:", err);
        }
    });
}


// =======================
// DELETE
// =======================
async function deleteProduct(id) {
    try {
        await fetch(`http://localhost:3000/delete-product/${id}`, {
            method: 'DELETE'
        });

        loadProducts();

    } catch (err) {
        console.log("DELETE ERROR:", err);
    }
}


// =======================
// CHART
// =======================
const ctx = document.getElementById('myChart');

if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Sales',
                data: [5000, 8000, 6000, 10000, 9000],
                borderWidth: 2
            }]
        }
    });
}
    final
const sellerId = localStorage.getItem("sellerId");

const addBtn = document.getElementById("addProductBtn");
const form = document.getElementById("addProductForm");

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

        const res = await fetch(`http://localhost:3000/my-products/${sellerId}`);
        const products = await res.json();

        const totalEl = document.getElementById("totalProducts");
        const table = document.getElementById("productTable");

        if (!table) return;

        totalEl.innerText = products.length;
        table.innerHTML = "";

        products.forEach(p => {
           table.innerHTML += `
<tr>
    <td><img src="http://localhost:3000/uploads/${p.image}" width="50"></td>
    <td>${p.name}</td>
    <td>${p.district || "-"}</td>
    <td>৳ ${p.price}</td>
    <td>
        <button onclick="editProduct('${p._id}', '${p.name}', '${p.price}', '${p.district}', '${p.size}', '${p.availability}')">Edit</button>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
    </td>
</tr>
`;
        });

    } catch (err) {
        console.log(err);
    }
}

loadProducts();
function goToEdit(id) {
    window.location.href = `edit-product.html?id=${id}`;
}
async function deleteProduct(id) {

    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    await fetch(`http://localhost:3000/delete-product/${id}`, {
        method: "DELETE"
    });

    loadProducts();
}
    //last
const sellerId = localStorage.getItem("sellerId");

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

        const res = await fetch(`http://localhost:3000/my-products/${sellerId}`);
        const products = await res.json();

        const totalEl = document.getElementById("totalProducts");
        const table = document.getElementById("productTable");

        if (!table) return;

        totalEl.innerText = products.length;
        table.innerHTML = "";

        products.forEach(p => {
            table.innerHTML += `
<tr>
    <td><img src="http://localhost:3000/uploads/${p.image}" width="50"></td>
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

    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:3000/delete-product/${id}`, {
        method: "DELETE"
    });

    loadProducts();
}

// =======================
// INIT
// =======================
loadProducts();*/
// =======================
// SELLER ID
// =======================
const sellerId = localStorage.getItem("sellerId");

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
            console.log("❌ sellerId not found");
            return;
        }

        const res = await fetch(`http://localhost:3000/my-products/${sellerId}`);
        const products = await res.json();

        const totalEl = document.getElementById("totalProducts");
        const table = document.getElementById("productTable");

        if (!table) return;

        totalEl.innerText = products.length;
        table.innerHTML = "";

        products.forEach(p => {
            table.innerHTML += `
<tr>
    <td><img src="http://localhost:3000/uploads/${p.image}" width="50"></td>
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

    await fetch(`http://localhost:3000/delete-product/${id}`, {
        method: "DELETE"
    });

    loadProducts();
}

// =======================
// 🔥 ORDER SYSTEM START
// =======================

// LOAD ORDERS
/*async function loadOrders() {
    try {
        if (!sellerId) return;

        const res = await fetch(`http://localhost:3000/seller/orders/${sellerId}`);
        const orders = await res.json();

        const orderDiv = document.getElementById("orders");
        if (!orderDiv) return;

        orderDiv.innerHTML = "";

        if (orders.length === 0) {
            orderDiv.innerHTML = "<p>No orders yet</p>";
            return;
        }

        orders.forEach(order => {

            let itemsHTML = "";

            order.items.forEach(item => {
                if (item.sellerId === sellerId) {
                    itemsHTML += `
                        <p>${item.name} (x${item.quantity}) - ৳ ${item.price}</p>
                    `;
                }
            });

            orderDiv.innerHTML += `
                <div style="border:1px solid #ddd; padding:10px; margin:10px 0;">
                    
                    <h4>Order ID: ${order._id}</h4>

                    <p><b>Name:</b> ${order.customer.name}</p>
                    <p><b>Phone:</b> ${order.customer.phone}</p>
                    <p><b>Address:</b> ${order.customer.address}</p>

                    ${itemsHTML}

                    <p><b>Total:</b> ৳ ${order.total || 0}</p>
                    <p><b>Status:</b> ${order.status}</p>

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

// UPDATE ORDER STATUS
async function updateOrder(id, status) {
    await fetch(`http://localhost:3000/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });

    loadOrders();
}*/
async function loadOrders() {
  try {

    if (!sellerId) return;

    const res = await fetch(`https://six4zilla.onrender.com/seller/orders/${sellerId}`);
    const orders = await res.json();

    const orderDiv = document.getElementById("orders");
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
  await fetch(`https://six4zilla.onrender.com/orders/${id}`, {
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