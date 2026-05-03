const sellerId = localStorage.getItem("sellerId");
const BASE_URL = "https://six4zilla.onrender.com";

// ================= LOAD SELLER =================
async function loadSeller() {
    try {
        const res = await fetch(`${BASE_URL}/seller/${sellerId}`);
        const data = await res.json();

        document.getElementById("name").innerText = data.name || "-";
        document.getElementById("email").innerText = data.email || "-";
        document.getElementById("store").innerText = data.storeName || "No Store";
        document.getElementById("district").innerText = data.district || "-";

    } catch (err) {
        console.log(err);
    }
}

// ================= LOAD PRODUCTS =================
async function loadProducts() {
    try {
        const res = await fetch(`${BASE_URL}/my-products/${sellerId}`);
        const products = await res.json();

        const box = document.getElementById("products");
        box.innerHTML = "";

        products.forEach(p => {
            box.innerHTML += `
            <div class="product">
                <img src="${p.image}">
                <h4>${p.name}</h4>
                <p>৳ ${p.price}</p>
            </div>
            `;
        });

    } catch (err) {
        console.log(err);
    }
}

// ================= EDIT =================
function editProfile(){
    window.location.href = "seller-edit.html";
}

loadSeller();
loadProducts();