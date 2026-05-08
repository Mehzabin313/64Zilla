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
  const BASE_URL = "https://six4zilla.onrender.com";

let currentProduct = null;
let qty = 1;

// ================= CART =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 🔥 UPDATE CART COUNT
function updateCartCount() {
  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = total;

  renderCart(); // 🔥 cart UI update
}

// ================= CART RENDER =================
function renderCart() {
  const orderReview = document.getElementById("order-review");
  if (!orderReview) return;

  let cart = getCart();
  orderReview.innerHTML = "";

  if (cart.length === 0) {
    orderReview.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const div = document.createElement("div");
    div.style.marginBottom = "10px";
    div.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        <img src="${item.image}" style="width:50px;height:50px;">
        <div>
          <p>${item.name}</p>
          <p>Qty: ${item.quantity}</p>
          <p>৳ ${itemTotal}</p>

          <button onclick="increase(${index})">+</button>
          <button onclick="decrease(${index})">-</button>
          <button onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
      <hr>
    `;
    orderReview.appendChild(div);
  });

  const totalDiv = document.createElement("h4");
  totalDiv.innerText = "Total: ৳ " + totalPrice;
  orderReview.appendChild(totalDiv);

  // Checkout Button
  const btn = document.createElement("button");
  btn.innerText = "Checkout";
  btn.style.width = "100%";
  btn.style.padding = "10px";
  btn.style.marginTop = "10px";

  btn.onclick = () => {
    window.location.href = "checkout.html";
  };

  orderReview.appendChild(btn);
}

// ================= CART ACTIONS =================
window.increase = function (index) {
  let cart = getCart();
  cart[index].quantity++;
  saveCart(cart);
  updateCartCount();
};

window.decrease = function (index) {
  let cart = getCart();

  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCount();
};

window.removeItem = function (index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
};

// ================= TOGGLE CART =================
function toggleCart() {
  const box = document.getElementById("order-review");
  if (!box) return;

  box.style.display = box.style.display === "block" ? "none" : "block";
}

// ================= LOAD PRODUCT =================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`);
    const item = await res.json();

    currentProduct = item;

    document.getElementById("productName").textContent = item.name;
    document.getElementById("productPrice").textContent = "৳ " + item.price;

    document.getElementById("mainProductImg").src =
      item.image.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`;

  } catch (err) {
    console.log(err);
  }
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
      image: currentProduct.image.startsWith("http")
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

  // cart icon click
  const cartDiv = document.getElementById("cartdiv");
  if (cartDiv) {
    cartDiv.addEventListener("click", toggleCart);
  }
});