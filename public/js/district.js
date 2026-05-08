// ==========================
// CONFIG
// ==========================
/*const BASE_URL = "https://six4zilla.onrender.com";


// ==========================
// GET DISTRICT FROM URL
// ==========================
const params = new URLSearchParams(window.location.search);
let district = params.get("district");

const allowed = ["dhaka", "tangail", "chittagong", "rajshahi"];

if (!district || !allowed.includes(district.toLowerCase())) {
    district = "dhaka"; // safe default
}

// normalize
district = district.toLowerCase().trim();


// ==========================
// SET DISTRICT NAME ON PAGE
// ==========================
const districtNameEl = document.getElementById("districtName");
if (districtNameEl) {
    districtNameEl.innerText = district.charAt(0).toUpperCase() + district.slice(1);
}


// ==========================
// LOAD PRODUCTS
// ==========================
async function loadDistrictProducts() {

    const container =
        document.getElementById("productList") ||
        document.getElementById("container2");

    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/products/district/${district}`);

        if (!res.ok) {
            throw new Error("Failed to fetch");
        }

        const products = await res.json();

        // clear old data
        container.innerHTML = "";

        // ==========================
        // EMPTY CASE
        // ==========================
        if (!products || products.length === 0) {
            container.innerHTML = `
                <h3 style="text-align:center; padding:20px;">
                    No products available in ${district}
                </h3>
            `;
            return;
        }

        // ==========================
        // RENDER PRODUCTS
        // ==========================
        products.forEach(p => {

            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <img src="${BASE_URL}/uploads/${p.image}" class="product-img" alt="${p.name}">

                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="price">৳ ${p.price}</p>
                    <p class="district">${p.district}</p>

                    <button onclick="addToCart('${p._id}')">
                        Add to Cart
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading products:", error);

        container.innerHTML = `
            <h3 style="text-align:center; padding:20px; color:red;">
                Failed to load products. Server error.
            </h3>
        `;
    }
}


// ==========================
// OPTIONAL: ADD TO CART
// ==========================
function addToCart(id) {
    alert("Added to cart: " + id);
}


// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", loadDistrictProducts);
// ==========================
// CONFIG
// ==========================
const BASE_URL = "https://six4zilla.onrender.com";


// ==========================
// GET DISTRICT FROM URL
// ==========================
const params = new URLSearchParams(window.location.search);
let district = params.get("district");

// normalize early
district = district ? district.toLowerCase().trim() : null;


// ==========================
// VALID DISTRICTS
// ==========================
const allowed = ["dhaka", "tangail", "chittagong", "rajshahi"];


// ==========================
// VALIDATION (IMPORTANT)
// ==========================
if (!district || !allowed.includes(district)) {

    const container = document.getElementById("productList");
    if (container) {
        container.innerHTML = `
            <h3 style="text-align:center; color:red; padding:20px;">
                Invalid district selected
            </h3>
        `;
    }

    throw new Error("Invalid district: " + district);
}


// ==========================
// SET DISTRICT NAME ON PAGE
// ==========================
const districtNameEl = document.getElementById("districtName");

if (districtNameEl) {
    districtNameEl.innerText =
        district.charAt(0).toUpperCase() + district.slice(1);
}


// ==========================
// LOAD PRODUCTS
// ==========================
async function loadDistrictProducts() {

    const container = document.getElementById("productList");

    if (!container) return;

    try {

        const res = await fetch(`${BASE_URL}/products/district/${district}`);

        if (!res.ok) {
            throw new Error("Server error");
        }

        const products = await res.json();

        container.innerHTML = "";

        // EMPTY STATE
        if (!products || products.length === 0) {
            container.innerHTML = `
                <h3 style="text-align:center; padding:20px;">
                    No products found in ${district}
                </h3>
            `;
            return;
        }

        // RENDER PRODUCTS
        products.forEach(p => {

            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <img src="${BASE_URL}/uploads/${p.image}" class="product-img">

                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>৳ ${p.price}</p>
                    <p>${p.district}</p>

                    <button onclick="addToCart('${p._id}')">
                        Add to Cart
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);

        container.innerHTML = `
            <h3 style="text-align:center; color:red; padding:20px;">
                Failed to load products
            </h3>
        `;
    }
}


// ==========================
// ADD TO CART (optional)
// ==========================
function addToCart(id) {
    alert("Added to cart: " + id);
}


// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", loadDistrictProducts);*/
//last 
/*
const BASE_URL = "https://six4zilla.onrender.com";

// get district from URL
const params = new URLSearchParams(window.location.search);
let district = params.get("district");

// validate
const allowed = [
  "dhaka",
  "tangail",
  "rajshahi",
  "bogura",
  "natore",
  "narsingdi",
  "barisal",
  "jamalpur",
  "khulna"
];

if (!district || !allowed.includes(district.toLowerCase())) {
  district = "dhaka";
}

district = district.toLowerCase();

// show name (optional)
const districtNameEl = document.getElementById("districtName");
if (districtNameEl) {
  districtNameEl.innerText =
    district.charAt(0).toUpperCase() + district.slice(1);
}

// load products
async function loadProducts() {
  const container = document.getElementById("productList");
   const plus = document.getElementById(`plus-${index}`);
    const minus = document.getElementById(`minus-${index}`);
    const countSpan = document.getElementById(`count-${index}`);
    const addBtn = document.getElementById(`add-${index}`);
  if (!container) return;

  try {
    const res = await fetch(`${BASE_URL}/products/district/${district}`);
    const products = await res.json();

    container.innerHTML = "";

    if (!products.length) {
      container.innerHTML = `<h3>No products in ${district}</h3>`;
      return;
    }

    products.forEach(p => {
      container.innerHTML += `
        <div class="product-card">
          <img src="${p.image}">
          <h3>${p.name}</h3>
          <p>৳ ${p.price}</p>
          <p>${p.district}</p>
          <div class="qty-box">
          <button id="minus-${index}">-</button>
          <span id="count-${index}">0</span>
          <button id="plus-${index}">+</button>
        </div>

        <button id="add-${index}">Add to Cart</button>
        </div>
      `;
    });

  } catch (err) {
    console.log(err);
    container.innerHTML = "Server Error";
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);*/
const BASE_URL = "https://six4zilla.onrender.com";

const params = new URLSearchParams(window.location.search);
let district = params.get("district");

const allowed = [
  "dhaka",
  "tangail",
  "rajshahi",
  "bogura",
  "natore",
  "narsingdi",
  "barisal",
  "jamalpur",
  "khulna"
];

if (!district || !allowed.includes(district.toLowerCase())) {
  district = "dhaka";
}

district = district.toLowerCase();

const container = document.getElementById("productList");

let cartItems = [];
let totalCart = 0;

function updateCart() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.innerText = totalCart;
}

async function loadProducts() {
  try {
    const res = await fetch(`${BASE_URL}/products/district/${district}`);
    const products = await res.json();

    container.innerHTML = "";

    if (!products.length) {
      container.innerHTML = `<h3>No products in ${district}</h3>`;
      return;
    }

    products.forEach((p, index) => {

      container.innerHTML += `
        <div class="product-card">
          <img src="${p.image}">
          <h3>${p.name}</h3>
          <p>৳ ${p.price}</p>
          <p>${p.district}</p>

          <div class="qty-box">
            <button id="minus-${index}">-</button>
            <span id="count-${index}">0</span>
            <button id="plus-${index}">+</button>
          </div>

          <button id="add-${index}">Add to Cart</button>
        </div>
      `;
    });

    // event binding (IMPORTANT)
    products.forEach((p, index) => {

      let count = 0;

      const plus = document.getElementById(`plus-${index}`);
      const minus = document.getElementById(`minus-${index}`);
      const countSpan = document.getElementById(`count-${index}`);
      const addBtn = document.getElementById(`add-${index}`);

      plus.onclick = () => {
        count++;
        countSpan.innerText = count;
      };

      minus.onclick = () => {
        if (count > 0) count--;
        countSpan.innerText = count;
      };

      addBtn.onclick = () => {
        let qty = count === 0 ? 1 : count;

        let exist = cartItems.find(x => x._id === p._id);

        if (exist) {
          exist.quantity += qty;
        } else {
          cartItems.push({ ...p, quantity: qty });
        }

        totalCart += qty;
        updateCart();

        count = 0;
        countSpan.innerText = 0;
      };

    });

  } catch (err) {
    console.log(err);
    container.innerHTML = "Server Error";
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);