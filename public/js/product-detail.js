/*const BASE_URL = "https://six4zilla.onrender.com";
  let currentProduct = null;
  let qty = 1;

  // ============ GET PRODUCT ID FROM URL ============
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  // ============ FETCH PRODUCT ============
  async function loadProduct() {
    if (!productId) {
      showError("Product ID not found");
      return;
    }

    try {
      // First try: fetch single product by ID
      const res = await fetch(`${BASE_URL}/products/${productId}`);
      
      if (res.ok) {
        const product = await res.json();
        renderProduct(product);
      } else {
        // Fallback: fetch all products and find by ID
        const allRes = await fetch(`${BASE_URL}/products`);
        const allProducts = await allRes.json();
        const product = allProducts.find(p => p._id === productId);
        if (product) {
          renderProduct(product);
          loadRelated(allProducts.filter(p => p._id !== productId));
        } else {
          showError("product is not found");
        }
      }
    } catch (err) {
      console.error(err);
      showError("server is not connected।");
    }
  }

  // ============ LOAD ALL (for related) ============
  async function loadAllProducts(currentId) {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const all = await res.json();
      loadRelated(all.filter(p => p._id !== currentId));
    } catch(e) {}
  }

  // ============ RENDER PRODUCT ============
  function renderProduct(item) {
    currentProduct = item;

    document.title = item.name + " | BanglarBazar";
    document.getElementById("breadcrumb-name").textContent = item.name;

    // Shop / seller name
    document.getElementById("shopName").textContent =
      item.shopName || item.seller || item.district + " Seller";

    // Name & subtitle
    document.getElementById("productName").textContent = item.name;
    document.getElementById("productSubtitle").textContent =
      item.subtitle || item.description || (item.district + " এর বিখ্যাত পণ্য");

    // Price
    document.getElementById("productPrice").textContent = "৳ " + item.price;

    if (item.originalPrice && item.originalPrice > item.price) {
      const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
      document.getElementById("productOldPrice").textContent = "৳ " + item.originalPrice;
      document.getElementById("productOldPrice").style.display = "inline";
      document.getElementById("discountBadge").textContent = discount + "% off";
      document.getElementById("discountBadge").style.display = "inline";
    }

    // Details
    document.getElementById("productWeight").textContent =
      item.weight || item.size || item.quantity || "—";
    document.getElementById("productDistrict").textContent = item.district || "—";
    document.getElementById("productCategory").textContent =
      item.category || item.type || "General";

    const stockEl = document.getElementById("productStock");
    if (item.stock === false || item.stock === 0) {
      stockEl.innerHTML = '<span class="stock-no">Out of Stock</span>';
    } else {
      stockEl.innerHTML = '<span class="stock-yes">✔ In Stock</span>';
    }

    // Description
    document.getElementById("productDesc").textContent =
      item.description || item.desc ||
      item.name + " — " + (item.district || "বাংলাদেশ") + " এর ঐতিহ্যবাহী পণ্য। সরাসরি উৎপাদকের কাছ থেকে সংগ্রহ করা হয়েছে।";

    // Image
    const imgSrc = getImage(item);
    document.getElementById("mainProductImg").src = imgSrc;

    // Thumbnails: main image + extras if available
    const thumbRow = document.getElementById("thumbRow");
    thumbRow.innerHTML = "";

    const allImages = item.images && item.images.length > 0
      ? item.images
      : [imgSrc, imgSrc, imgSrc]; // show same image 3x if no extras

    allImages.forEach((src, i) => {
      const div = document.createElement("div");
      div.className = "thumb-item" + (i === 0 ? " active" : "");
      div.innerHTML = `<img src="${src}" alt="thumb">`;
      div.onclick = () => {
        document.getElementById("mainProductImg").src = src;
        document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
        div.classList.add("active");
      };
      thumbRow.appendChild(div);
    });

    // Show card, hide loading
    document.getElementById("loadingState").style.display = "none";
    document.getElementById("detailCard").style.display = "grid";

    // Load related
    loadAllProducts(item._id);
  }

  // ============ RELATED PRODUCTS ============
  function loadRelated(products) {
    if (!products || products.length === 0) return;
    const grid = document.getElementById("relatedGrid");
    grid.innerHTML = "";
    const show = products.slice(0, 6);
    show.forEach(item => {
      const card = document.createElement("div");
      card.className = "related-card";
      card.innerHTML = `
        <img src="${getImage(item)}" alt="${item.name}"
          onerror="this.src='images/default.png'">
        <div class="related-card-info">
          <p class="related-card-name">${item.name}</p>
          <p class="related-card-district">${item.district || ""}</p>
          <p class="related-card-price">৳ ${item.price}</p>
        </div>
      `;
      card.onclick = () => {
        window.location.href = `product-detail.html?id=${item._id}`;
      };
      grid.appendChild(card);
    });
    document.getElementById("relatedSection").style.display = "block";
  }

  // ============ IMAGE HELPER ============
  function getImage(item) {
    if (!item.image) return "images/default.png";
    if (item.image.startsWith("http")) return item.image;
    return `${BASE_URL}/uploads/${item.image}`;
  }

  // ============ QUANTITY ============
  function changeQty(d) {
    qty = Math.max(1, qty + d);
    document.getElementById("qtyDisplay").textContent = qty;
  }

  // ============ ADD TO CART ============
  function addToCart() {
    if (!currentProduct) return;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exist = cart.find(p => p._id === currentProduct._id);
    if (exist) {
      exist.quantity += qty;
    } else {
      cart.push({ ...currentProduct, quantity: qty });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(qty + "item " + currentProduct.name + " Added to cart!");
  }

  // ============ BUY NOW ============
  function buyNow() {
    if (!currentProduct) return;
    let cart = [{ ...currentProduct, quantity: qty }];
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
  }

  // ============ TOAST ============
  function showToast(msg) {
    const t = document.getElementById("toastMsg");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
  }

  // ============ ERROR ============
  function showError(msg) {
    document.getElementById("loadingState").innerHTML = `
      <p style="color:#c0392b;font-size:15px;">⚠️ ${msg}</p>
      <a href="index.html" style="color:var(--green);text-decoration:none;font-size:14px;">← Home </a>
    `;
  }

  // ============ INIT ============
  loadProduct();*/
  //last 
  
  /*const BASE_URL = "https://six4zilla.onrender.com";

let currentProduct = null;
let qty = 1;

// ================= GET CART =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= CART COUNT =================
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = total;

  renderCart();
}

// ================= CART RENDER =================
function renderCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  let cart = getCart();

  box.innerHTML = `
    <div class="cart-header">
      <h4>🛒 Cart</h4>
      <button onclick="toggleCart()" class="close-btn">×</button>
    </div>
  `;

  if (cart.length === 0) {
    box.innerHTML += "<p style='padding:10px'>Cart is empty</p>";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    box.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" />
        <div>
          <p>${item.name}</p>
          <p>Qty: ${item.quantity}</p>
          <p>৳ ${itemTotal}</p>

          <button onclick="inc(${index})">+</button>
          <button onclick="dec(${index})">-</button>
          <button onclick="remove(${index})">X</button>
        </div>
      </div>
      <hr>
    `;
  });

  box.innerHTML += `
    <div class="cart-footer">
      <h4>Total: ৳ ${totalPrice}</h4>
      <button onclick="checkout()" style="width:100%;padding:10px;background:green;color:white;border:none;">
        Checkout
      </button>
    </div>
  `;
}

// ================= CART ACTIONS =================
window.inc = function (i) {
  let cart = getCart();
  cart[i].quantity++;
  saveCart(cart);
  updateCartCount();
};

window.dec = function (i) {
  let cart = getCart();

  if (cart[i].quantity > 1) cart[i].quantity--;
  else cart.splice(i, 1);

  saveCart(cart);
  updateCartCount();
};

window.remove = function (i) {
  let cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  updateCartCount();
};

// ================= TOGGLE CART =================
function toggleCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  box.style.display = box.style.display === "block" ? "none" : "block";
}

// ================= CHECKOUT =================
function checkout() {
  window.location.href = "checkout.html";
}

// ================= PRODUCT ID =================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ================= LOAD PRODUCT (FIXED SAFE VERSION) =================
async function loadProduct() {
  try {
    if (!productId) throw new Error("No product id");

    let res = await fetch(`${BASE_URL}/products/${productId}`);

    let item;

    if (res.ok) {
      item = await res.json();
    } else {
      // fallback
      const allRes = await fetch(`${BASE_URL}/products`);
      const all = await allRes.json();

      item = all.find(p => p._id === productId);
    }

    if (!item) throw new Error("Product not found");

    currentProduct = item;

    // UI show
    const loader = document.getElementById("loadingState");
    const card = document.getElementById("detailCard");

    if (loader) loader.style.display = "none";
    if (card) card.style.display = "grid";

    document.getElementById("productName").textContent = item.name || "";
    document.getElementById("productPrice").textContent = "৳ " + item.price;

    const img = document.getElementById("mainProductImg");

    if (img) {
      img.src = item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`;
    }

  } catch (err) {
    console.log("LOAD ERROR:", err);

    document.getElementById("loadingState").innerHTML = `
      <p style="color:red">⚠️ Product load failed</p>
      <button onclick="location.reload()">Retry</button>
    `;
  }
}
// ============ RELATED PRODUCTS ============
  function loadRelated(products) {
    if (!products || products.length === 0) return;
    const grid = document.getElementById("relatedGrid");
    grid.innerHTML = "";
    const show = products.slice(0, 6);
    show.forEach(item => {
      const card = document.createElement("div");
      card.className = "related-card";
      card.innerHTML = `
        <img src="${getImage(item)}" alt="${item.name}"
          onerror="this.src='images/default.png'">
        <div class="related-card-info">
          <p class="related-card-name">${item.name}</p>
          <p class="related-card-district">${item.district || ""}</p>
          <p class="related-card-price">৳ ${item.price}</p>
        </div>
      `;
      card.onclick = () => {
        window.location.href = `product-detail.html?id=${item._id}`;
      };
      grid.appendChild(card);
    });
    document.getElementById("relatedSection").style.display = "block";
  }

// ================= ADD TO CART =================
function addToCart() {
  if (!currentProduct) return;

  let cart = getCart();

  const exist = cart.find(p => p._id === currentProduct._id);

  if (exist) {
    exist.quantity += qty;
  } else {
    cart.push({
      ...currentProduct,
      quantity: qty,
      image: currentProduct.image?.startsWith("http")
        ? currentProduct.image
        : `${BASE_URL}/uploads/${currentProduct.image}`
    });
  }

  saveCart(cart);
  updateCartCount();
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
  updateCartCount();

  const cartBtn = document.getElementById("cartdiv");
  if (cartBtn) {
    cartBtn.addEventListener("click", toggleCart);
  }
});*/
/*const BASE_URL = "https://six4zilla.onrender.com";

let currentProduct = null;
let qty = 1;

// ================= CART GET =================
// লোকাল স্টোরেজ থেকে cart আনা হচ্ছে
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// cart save করা
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= CART COUNT UPDATE =================
// cart icon এর সংখ্যা update করা হচ্ছে
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const cart = getCart();

  // total quantity যোগ করা হচ্ছে
  el.textContent = cart.reduce((s, i) => s + i.quantity, 0);

  // cart UI render
  renderCart();
}

// ================= GET PRODUCT ID FROM URL =================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ================= LOAD PRODUCT =================
async function loadProduct() {
  try {
    if (!productId) throw new Error("No product id in URL");

    // backend থেকে single product আনা
    const res = await fetch(`${BASE_URL}/products/${productId}`);

    let item;

    if (res.ok) {
      item = await res.json();
    } else {
      // fallback: full product list fetch
      const all = await fetch(`${BASE_URL}/products`).then(r => r.json());

      // id match করে product খোঁজা
      item = all.find(p => p._id === productId);
    }

    if (!item) throw new Error("Product not found");

    currentProduct = item;

    // product UI render করা
    renderProduct(item);

    // related product load করা
    loadRelatedProducts(item._id);

    // loading hide
    document.getElementById("loadingState").style.display = "none";
    document.getElementById("detailCard").style.display = "grid";

  } catch (err) {
    console.log(err);

    // error UI show
    document.getElementById("loadingState").innerHTML = `
      <p style="color:red">⚠️ Product load failed</p>
    `;
  }
}

// ================= PRODUCT RENDER =================
function renderProduct(item) {

  // product name set
  document.getElementById("productName").textContent = item.name;

  // price set
  document.getElementById("productPrice").textContent = "৳ " + item.price;

  // ================= DESCRIPTION FIX =================
  const desc = document.getElementById("productDesc");
  if (desc) {
    desc.textContent =
      item.description ||
      item.desc ||
      item.name + " — Traditional product";
  }

  // ================= IMAGE SET =================
  const img = document.getElementById("mainProductImg");
  if (img) {
    img.src = item.image?.startsWith("http")
      ? item.image
      : `${BASE_URL}/uploads/${item.image}`;
  }
}

// ================= RELATED PRODUCTS =================
async function loadRelatedProducts(id) {
  try {
    const grid = document.getElementById("relatedGrid");
    if (!grid) return;

    const all = await fetch(`${BASE_URL}/products`).then(r => r.json());

    // current product বাদ দিয়ে related বানানো
    const related = all.filter(p => p._id !== id).slice(0, 6);

    grid.innerHTML = "";

    related.forEach(p => {
      const div = document.createElement("div");
      div.className = "related-card";

      div.innerHTML = `
        <img src="${p.image}" style="width:100%;height:120px;object-fit:cover;">
        <p>${p.name}</p>
        <p>৳ ${p.price}</p>
      `;

      // click করলে product change
      div.onclick = () => {
        window.location.href = `product-detail.html?id=${p._id}`;
      };

      grid.appendChild(div);
    });

    // related section show করা
    const sec = document.getElementById("relatedSection");
    if (sec) sec.style.display = "block";

  } catch (e) {
    console.log("related error", e);
  }
}

// ================= IMAGE HELPER =================
function getImage(item) {
  if (!item.image) return "images/default.png";

  if (item.image.startsWith("http")) return item.image;

  return `${BASE_URL}/uploads/${item.image}`;
}

// ================= ADD TO CART =================
function addToCart() {
  if (!currentProduct) return;

  let cart = getCart();

  const exist = cart.find(p => p._id === currentProduct._id);

  if (exist) {
    exist.quantity += qty; // যদি আগে থাকে quantity add হবে
  } else {
    cart.push({ ...currentProduct, quantity: qty });
  }

  saveCart(cart);

  // cart count update
  updateCartCount();
}

// ================= CART UI RENDER =================
function renderCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  const cart = getCart();

  if (cart.length === 0) {
    box.innerHTML = "<p>Cart empty</p>";
    return;
  }

  let total = 0;

  box.innerHTML = cart.map((i) => {
    total += i.price * i.quantity;

    return `
      <div>
        <p>${i.name}</p>
        <p>Qty: ${i.quantity}</p>
        <p>৳ ${i.price * i.quantity}</p>
      </div>
      <hr>
    `;
  }).join("");

  box.innerHTML += `<h4>Total: ৳ ${total}</h4>`;
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  // product load
  loadProduct();

  // cart sync
  updateCartCount();

  // cart toggle click
  const cart = document.getElementById("cartdiv");

  if (cart) {
    cart.addEventListener("click", () => {
      const box = document.getElementById("order-review");

      if (!box) return;

      box.style.display = box.style.display === "block" ? "none" : "block";
    });
  }
});*/
/*
const BASE_URL = "https://six4zilla.onrender.com";

let currentProduct = null;
let qty = 1;

// ================= GET CART =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= CART COUNT =================
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = total;

  renderCart();
}

// ================= CART RENDER =================
function renderCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  let cart = getCart();

  box.innerHTML = `
    <div class="cart-header">
      <h4>🛒 Cart</h4>
      <button onclick="toggleCart()" class="close-btn">×</button>
    </div>
  `;

  if (cart.length === 0) {
    box.innerHTML += "<p style='padding:10px'>Cart is empty</p>";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    box.innerHTML += `
  <div class="cart-item">

    <!-- FIX: Proper image fallback -->
    <img src="${
      item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`
    }" class="cart-img" />

    <div class="cart-info">
      <p class="cart-name">${item.name}</p>

      <!-- FIX: Quantity show -->
      <p class="cart-qty">
        Qty: <b>${item.quantity}</b>
      </p>

      <p class="cart-price">৳ ${itemTotal}</p>

      <div class="cart-actions">
        <button onclick="inc(${index})">+</button>
        <button onclick="dec(${index})">-</button>

        <!-- FIX: Cross delete button -->
        <button onclick="remove(${index})" class="remove-btn">×</button>
      </div>
    </div>

  </div>
  <hr>
`;
  });

  box.innerHTML += `
    <div class="cart-footer">
      <h4>Total: ৳ ${totalPrice}</h4>
      <button onclick="checkout()" style="width:100%;padding:10px;background:green;color:white;border:none;">
        Checkout
      </button>
    </div>
  `;
}

// ================= CART ACTIONS =================
window.inc = function (i) {
  let cart = getCart();
  cart[i].quantity++;
  saveCart(cart);
  updateCartCount();
};

window.dec = function (i) {
  let cart = getCart();

  if (cart[i].quantity > 1) cart[i].quantity--;
  else cart.splice(i, 1);

  saveCart(cart);
  updateCartCount();
};

window.remove = function (i) {
  let cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  updateCartCount();
};

// ================= TOGGLE CART =================
function toggleCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  box.style.display = box.style.display === "block" ? "none" : "block";
}

// ================= PRODUCT ID =================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ================= LOAD PRODUCT =================
async function loadProduct() {
  try {
    if (!productId) throw new Error("No product id");

    let res = await fetch(`${BASE_URL}/products/${productId}`);

    let item;

    if (res.ok) {
      item = await res.json();
    } else {
      const allRes = await fetch(`${BASE_URL}/products`);
      const all = await allRes.json();

      item = all.find(p => p._id === productId);
    }

    if (!item) throw new Error("Product not found");

    currentProduct = item;

    document.getElementById("loadingState").style.display = "none";
    document.getElementById("detailCard").style.display = "grid";

    document.getElementById("productName").textContent = item.name || "";
    document.getElementById("productPrice").textContent = "৳ " + item.price;

    document.getElementById("mainProductImg").src =
      item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`;

  
    loadAllProducts(item._id);

  } catch (err) {
    document.getElementById("loadingState").innerHTML = `
      <p style="color:red">⚠️ Product load failed</p>
      <button onclick="location.reload()">Retry</button>
    `;
  }
}

// ================= RELATED PRODUCTS =================
function loadRelated(products) {
  if (!products || products.length === 0) return;

  const grid = document.getElementById("relatedGrid");

  grid.innerHTML = "";

  const show = products.slice(0, 6);

  show.forEach(item => {
    const card = document.createElement("div");
    card.className = "related-card";

    card.innerHTML = `
      <img src="${item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`}" />

      <div class="related-card-info">
        <p>${item.name}</p>
        <p>${item.district || ""}</p>
        <p>৳ ${item.price}</p>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `product-detail.html?id=${item._id}`;
    };

    grid.appendChild(card);
  });

  

  document.getElementById("relatedSection").style.display = "block";
}

// ================= LOAD ALL FOR RELATED =================
async function loadAllProducts(currentId) {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const all = await res.json();

    loadRelated(all.filter(p => p._id !== currentId));
  } catch (e) {}
}

// ================= ADD TO CART =================
function addToCart() {
  if (!currentProduct) return;

  let cart = getCart();

  const exist = cart.find(p => p._id === currentProduct._id);

  if (exist) exist.quantity += qty;
  else {
    cart.push({
      ...currentProduct,
      quantity: qty,

      // FIX 4: IMAGE NOT SHOW IN CART FIX
      // আগে image path ছিল না properly set
      image: currentProduct.image?.startsWith("http")
        ? currentProduct.image
        : `${BASE_URL}/uploads/${currentProduct.image}`
    });
  }

  saveCart(cart);
  updateCartCount();
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
  updateCartCount();

  const cartBtn = document.getElementById("cartdiv");
  if (cartBtn) cartBtn.addEventListener("click", toggleCart);
});*/
/*
const BASE_URL = "https://six4zilla.onrender.com";

let currentProduct = null;
let qty = 1;

// ================= GET CART =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= CART COUNT =================
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = total;

  renderCart();
}

// ================= CART RENDER =================
function renderCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  let cart = getCart();

  box.innerHTML = `
    <div class="cart-header">
      <h4>🛒 Cart</h4>
      <button onclick="toggleCart()" class="close-btn">×</button>
    </div>
  `;

  if (cart.length === 0) {
    box.innerHTML += "<p style='padding:10px'>Cart is empty</p>";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    box.innerHTML += `
      <div class="cart-item">

        <img src="${
          item.image?.startsWith("http")
            ? item.image
            : `${BASE_URL}/uploads/${item.image}`
        }" class="cart-img" />

        <div class="cart-info">
          <p class="cart-name">${item.name}</p>

          <p class="cart-qty">Qty: <b>${item.quantity}</b></p>

          <p class="cart-price">৳ ${itemTotal}</p>

          <div class="cart-actions">
            <button onclick="inc(${index})">+</button>
            <button onclick="dec(${index})">-</button>
            <button onclick="remove(${index})" class="remove-btn">×</button>
          </div>
        </div>

      </div>
      <hr>
    `;
  });

  box.innerHTML += `
    <div class="cart-footer">
      <h4>Total: ৳ ${totalPrice}</h4>
      <button onclick="checkout()" style="width:100%;padding:10px;background:green;color:white;border:none;">
        Checkout
      </button>
    </div>
  `;
}

// ================= CART ACTIONS =================
window.inc = function (i) {
  let cart = getCart();
  cart[i].quantity++;
  saveCart(cart);
  updateCartCount();
};

window.dec = function (i) {
  let cart = getCart();

  if (cart[i].quantity > 1) cart[i].quantity--;
  else cart.splice(i, 1);

  saveCart(cart);
  updateCartCount();
};

window.remove = function (i) {
  let cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  updateCartCount();
};

// ================= TOGGLE CART =================
function toggleCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  box.style.display = box.style.display === "block" ? "none" : "block";
}

// ================= PRODUCT ID =================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ================= LOAD PRODUCT =================
async function loadProduct() {
  try {
    if (!productId) throw new Error("No product id");

    let res = await fetch(`${BASE_URL}/products/${productId}`);

    let item;

    if (res.ok) {
      item = await res.json();
    } else {
      const allRes = await fetch(`${BASE_URL}/products`);
      const all = await allRes.json();
      item = all.find(p => p._id === productId);
    }

    if (!item) throw new Error("Product not found");

    currentProduct = item;

    document.getElementById("loadingState").style.display = "none";
    document.getElementById("detailCard").style.display = "grid";

    // ================= BASIC INFO =================
    document.getElementById("productName").textContent = item.name || "";
    document.getElementById("productPrice").textContent = "৳ " + item.price;

    document.getElementById("mainProductImg").src =
      item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`;

    // ================= EXTRA DETAILS (FIXED) =================

    // Seller / Address
    const shop = document.getElementById("shopName");
    if (shop) {
      shop.textContent =
        item.shopName || item.seller || item.district || "Seller";
    }

    // Weight
    const weight = document.getElementById("productWeight");
    if (weight) {
      weight.textContent = item.weight || item.size || "—";
    }

    // Description
    const desc = document.getElementById("productDesc");
    if (desc) {
      desc.textContent =
        item.description ||
        item.desc ||
        `${item.name} — Bangladesh Product`;
    }

    // Availability
    const stock = document.getElementById("productStock");
    if (stock) {
      if (item.stock === false || item.stock === 0) {
        stock.textContent = "Out of Stock";
        stock.style.color = "red";
      } else {
        stock.textContent = "In Stock";
        stock.style.color = "green";
      }
    }

    // ================= RELATED =================
    loadAllProducts(item._id);

  } catch (err) {
    document.getElementById("loadingState").innerHTML = `
      <p style="color:red">⚠️ Product load failed</p>
      <button onclick="location.reload()">Retry</button>
    `;
  }
}

// ================= RELATED PRODUCTS =================
function loadRelated(products) {
  if (!products || products.length === 0) return;

  const grid = document.getElementById("relatedGrid");
  grid.innerHTML = "";

  const show = products.slice(0, 6);

  show.forEach(item => {
    const card = document.createElement("div");
    card.className = "related-card";

    card.innerHTML = `
      <img src="${
        item.image?.startsWith("http")
          ? item.image
          : `${BASE_URL}/uploads/${item.image}`
      }" />

      <div class="related-card-info">
        <p>${item.name}</p>
        <p>${item.district || ""}</p>
        <p>৳ ${item.price}</p>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `product-detail.html?id=${item._id}`;
    };

    grid.appendChild(card);
  });

  document.getElementById("relatedSection").style.display = "block";
}

// ================= LOAD ALL PRODUCTS =================
async function loadAllProducts(currentId) {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const all = await res.json();

    loadRelated(all.filter(p => p._id !== currentId));
  } catch (e) {}
}

// ================= ADD TO CART =================
function addToCart() {
  if (!currentProduct) return;

  let cart = getCart();

  const exist = cart.find(p => p._id === currentProduct._id);

  const product = {
    ...currentProduct,
    quantity: qty,
    image: currentProduct.image?.startsWith("http")
      ? currentProduct.image
      : `${BASE_URL}/uploads/${currentProduct.image}`
  };

  if (exist) exist.quantity += qty;
  else cart.push(product);

  saveCart(cart);
  updateCartCount();
}

// ================= BUY NOW =================
function buyNow() {
  if (!currentProduct) return;

  const cart = [
    {
      ...currentProduct,
      quantity: qty,
      image: currentProduct.image?.startsWith("http")
        ? currentProduct.image
        : `${BASE_URL}/uploads/${currentProduct.image}`
    }
  ];

  localStorage.setItem("cart", JSON.stringify(cart));

  window.location.href = "checkout.html";
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
  updateCartCount();

  const cartBtn = document.getElementById("cartdiv");
  if (cartBtn) cartBtn.addEventListener("click", toggleCart);
});*/
/*const BASE_URL = "https://six4zilla.onrender.com";

let currentProduct = null;
let qty = 1;


function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}


function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const cart = getCart();
  el.textContent = cart.reduce((s, i) => s + i.quantity, 0);

  renderCart();
}


function renderCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  const cart = getCart();

  box.innerHTML = `
    <div class="cart-header">
      <h4>🛒 Cart</h4>
      <button onclick="toggleCart()" class="close-btn">×</button>
    </div>
  `;

  if (cart.length === 0) {
    box.innerHTML += "<p style='padding:10px'>Cart is empty</p>";
    return;
  }

  let total = 0;

  cart.forEach((item, i) => {
    const price = item.price * item.quantity;
    total += price;

    box.innerHTML += `
      <div class="cart-item">
        <img src="${
          item.image?.startsWith("http")
            ? item.image
            : `${BASE_URL}/uploads/${item.image}`
        }" class="cart-img"/>

        <div>
          <p>${item.name}</p>
          <p>Qty: ${item.quantity}</p>
          <p>৳ ${price}</p>

          <button onclick="inc(${i})">+</button>
          <button onclick="dec(${i})">-</button>
          <button onclick="removeItem(${i})">×</button>
        </div>
      </div>
    `;
  });

  box.innerHTML += `
    <h4>Total: ৳ ${total}</h4>
    <button onclick="checkout()" style="width:100%;padding:10px;background:green;color:#fff;">
      Checkout
    </button>
  `;
}


window.inc = function (i) {
  let cart = getCart();
  cart[i].quantity++;
  saveCart(cart);
  updateCartCount();
};

window.dec = function (i) {
  let cart = getCart();

  if (cart[i].quantity > 1) cart[i].quantity--;
  else cart.splice(i, 1);

  saveCart(cart);
  updateCartCount();
};

window.removeItem = function (i) {
  let cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  updateCartCount();
};


function toggleCart() {
  const box = document.getElementById("order-review");
  if (!box) return;
  box.style.display = box.style.display === "block" ? "none" : "block";
}


function checkout() {
  window.location.href = "checkout.html";
}
window.checkout = checkout;


function buyNow() {
  if (!currentProduct) return;

  const cart = [
    {
      ...currentProduct,
      quantity: qty,
      image: currentProduct.image?.startsWith("http")
        ? currentProduct.image
        : `${BASE_URL}/uploads/${currentProduct.image}`
    }
  ];

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
}
window.buyNow = buyNow;

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
  try {
    if (!productId) throw new Error("No product id");

    const res = await fetch(`${BASE_URL}/products/${productId}`);

    let item;

    if (res.ok) {
      item = await res.json();
    } else {
      const all = await fetch(`${BASE_URL}/products`).then(r => r.json());
      item = all.find(p => p._id === productId);
    }

    if (!item) throw new Error("Not found");

    currentProduct = item;

    document.getElementById("loadingState").style.display = "none";
    document.getElementById("detailCard").style.display = "grid";

    document.getElementById("productName").textContent = item.name;
    document.getElementById("productPrice").textContent = "৳ " + item.price;

    document.getElementById("mainProductImg").src =
      item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`;

    const shop = document.getElementById("shopName");
    if (shop) shop.textContent = item.shopName || item.seller || item.district;

    const desc = document.getElementById("productDesc");
    if (desc) desc.textContent = item.description || item.desc || item.name;

    const stock = document.getElementById("productStock");
    if (stock) {
      stock.textContent = item.stock ? "In Stock" : "Out of Stock";
      stock.style.color = item.stock ? "green" : "red";
    }

    loadAllProducts(item._id);

  } catch (err) {
    document.getElementById("loadingState").innerHTML =
      "<p style='color:red'>Failed to load product</p>";
  }
}


function loadRelated(products) {
  const grid = document.getElementById("relatedGrid");
  if (!grid) return;

  grid.innerHTML = "";

  products.slice(0, 6).forEach(p => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${
        p.image?.startsWith("http")
          ? p.image
          : `${BASE_URL}/uploads/${p.image}`
      }" style="width:100%;height:120px;object-fit:cover"/>
      <p>${p.name}</p>
      <p>৳ ${p.price}</p>
    `;

    div.onclick = () => {
      window.location.href = `product-detail.html?id=${p._id}`;
    };

    grid.appendChild(div);
  });

  document.getElementById("relatedSection").style.display = "block";
}


async function loadAllProducts(id) {
  const all = await fetch(`${BASE_URL}/products`).then(r => r.json());
  loadRelated(all.filter(p => p._id !== id));
}


function addToCart() {
  if (!currentProduct) return;

  let cart = getCart();

  const exist = cart.find(p => p._id === currentProduct._id);

  const product = {
    ...currentProduct,
    quantity: qty,
    image: currentProduct.image?.startsWith("http")
      ? currentProduct.image
      : `${BASE_URL}/uploads/${currentProduct.image}`
  };

  if (exist) exist.quantity += qty;
  else cart.push(product);

  saveCart(cart);
  updateCartCount();
}


document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
  updateCartCount();

  const cartBtn = document.getElementById("cartdiv");
  if (cartBtn) cartBtn.addEventListener("click", toggleCart);

  const menu = document.getElementById("menu");
  if (menu) {
    menu.addEventListener("click", () => {
      const box = document.getElementById("order-review");
      if (box) {
        box.style.display =
          box.style.display === "block" ? "none" : "block";
      }
    });
  }
});*/
const BASE_URL = "https://six4zilla.onrender.com";

let currentProduct = null;
let qty = 1;

/* ================= CART ================= */
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= CART COUNT ================= */
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const cart = getCart();
  el.textContent = cart.reduce((s, i) => s + i.quantity, 0);

  renderCart();
}

/* ================= CART RENDER ================= */
function renderCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  const cart = getCart();

  box.innerHTML = `
    <div class="cart-header">
      <h4>🛒 Cart</h4>
      <button onclick="toggleCart()" class="close-btn">×</button>
    </div>
  `;

  if (cart.length === 0) {
    box.innerHTML += "<p style='padding:10px'>Cart is empty</p>";
    return;
  }

  let total = 0;

  cart.forEach((item, i) => {
    const price = item.price * item.quantity;
    total += price;

    box.innerHTML += `
      <div class="cart-item">
        <img src="${
          item.image?.startsWith("http")
            ? item.image
            : `${BASE_URL}/uploads/${item.image}`
        }" class="cart-img"/>

        <div>
          <p>${item.name}</p>
          <p>Qty: ${item.quantity}</p>
          <p>৳ ${price}</p>

          <button onclick="inc(${i})">+</button>
          <button onclick="dec(${i})">-</button>
          <button onclick="removeItem(${i})">×</button>
        </div>
      </div>
    `;
  });

  box.innerHTML += `
    <h4>Total: ৳ ${total}</h4>
    <button onclick="checkout()" style="width:100%;padding:10px;background:green;color:#fff;">
      Checkout
    </button>
  `;
}

/* ================= CART ACTIONS ================= */
window.inc = function (i) {
  let cart = getCart();
  cart[i].quantity++;
  saveCart(cart);
  updateCartCount();
};

window.dec = function (i) {
  let cart = getCart();
  if (cart[i].quantity > 1) cart[i].quantity--;
  else cart.splice(i, 1);
  saveCart(cart);
  updateCartCount();
};

window.removeItem = function (i) {
  let cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  updateCartCount();
};

/* ================= TOGGLE CART ================= */
function toggleCart() {
  const box = document.getElementById("order-review");
  if (!box) return;
  box.style.display = box.style.display === "block" ? "none" : "block";
}

/* ================= CHECKOUT ================= */
function checkout() {
  window.location.href = "checkout.html";
}
window.checkout = checkout;

/* ================= BUY NOW ================= */
function buyNow() {
  if (!currentProduct) return;

  const cart = [{
    ...currentProduct,
    quantity: qty,
    image: currentProduct.image?.startsWith("http")
      ? currentProduct.image
      : `${BASE_URL}/uploads/${currentProduct.image}`
  }];

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
}
window.buyNow = buyNow;

/* ================= PRODUCT ID ================= */
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

/* ================= LOAD PRODUCT ================= */
async function loadProduct() {
  try {
    if (!productId) throw new Error("No product id");

    const res = await fetch(`${BASE_URL}/products/${productId}`);

    let item;

    if (res.ok) {
      item = await res.json();
    } else {
      const all = await fetch(`${BASE_URL}/products`).then(r => r.json());
      item = all.find(p => p._id === productId);
    }

    if (!item) throw new Error("Not found");

    currentProduct = item;

    /* ===== NORMALIZE (IMPORTANT FIX) ===== */
    item.stock = item.stock ?? true;
    item.district = item.district || "Unknown";
    item.category = item.category || "General";

    /* ===== UI ===== */
    document.getElementById("loadingState").style.display = "none";
    document.getElementById("detailCard").style.display = "grid";

    document.getElementById("productName").textContent = item.name;
    document.getElementById("productPrice").textContent = "৳ " + item.price;

    document.getElementById("mainProductImg").src =
      item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`;

    /* ===== SHOP ===== */
    const shop = document.getElementById("shopName");
    if (shop) shop.textContent = item.shopName || item.seller || item.district;

    /* ===== DESCRIPTION ===== */
    const desc = document.getElementById("productDesc");
    if (desc) desc.textContent = item.description || item.desc || item.name;

    /* ===== WEIGHT / SIZE FIX ===== */
    const weight = document.getElementById("productWeight");
    if (weight) {
      weight.textContent =
        item.weight ??
        item.size ??
        item.quantity ??
        "Not specified";
    }

    /* ===== CATEGORY FIX ===== */
    const category = document.getElementById("productCategory");
    if (category) {
      category.textContent = item.category || item.type || "General";
    }

    /* ===== STOCK FIX ===== */
    const stock = document.getElementById("productStock");
    if (stock) {
      if (item.stock === false || item.stock === 0) {
        stock.textContent = "Out of Stock";
        stock.style.color = "red";
      } else {
        stock.textContent = "In Stock";
        stock.style.color = "green";
      }
    }

    loadAllProducts(item._id);

  } catch (err) {
    document.getElementById("loadingState").innerHTML =
      "<p style='color:red'>Failed to load product</p>";
  }
}

/* ================= RELATED ================= */
function loadRelated(products) {
  const grid = document.getElementById("relatedGrid");
  if (!grid) return;

  grid.innerHTML = "";

  products.slice(0, 6).forEach(p => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${
        p.image?.startsWith("http")
          ? p.image
          : `${BASE_URL}/uploads/${p.image}`
      }" style="width:100%;height:120px;object-fit:cover"/>
      <p>${p.name}</p>
      <p>৳ ${p.price}</p>
    `;

    div.onclick = () => {
      window.location.href = `product-detail.html?id=${p._id}`;
    };

    grid.appendChild(div);
  });

  document.getElementById("relatedSection").style.display = "block";
}

/* ================= ALL PRODUCTS ================= */
async function loadAllProducts(id) {
  const all = await fetch(`${BASE_URL}/products`).then(r => r.json());
  loadRelated(all.filter(p => p._id !== id));
}

/* ================= ADD TO CART ================= */
function addToCart() {
  if (!currentProduct) return;

  let cart = getCart();

  const exist = cart.find(p => p._id === currentProduct._id);

  const product = {
    ...currentProduct,
    quantity: qty,
    image: currentProduct.image?.startsWith("http")
      ? currentProduct.image
      : `${BASE_URL}/uploads/${currentProduct.image}`
  };

  if (exist) exist.quantity += qty;
  else cart.push(product);

  saveCart(cart);
  updateCartCount();
}
window.addToCart = addToCart;

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
  updateCartCount();

  const cartBtn = document.getElementById("cartdiv");
  if (cartBtn) cartBtn.addEventListener("click", toggleCart);
});