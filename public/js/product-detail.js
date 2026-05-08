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

// 🔥 CHANGE 1: cart count update function added
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  let total = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = total;
  }
}

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
    const res = await fetch(`${BASE_URL}/products/${productId}`);

    if (res.ok) {
      const product = await res.json();
      renderProduct(product);
    } else {
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

// ============ LOAD ALL ============
async function loadAllProducts(currentId) {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const all = await res.json();
    loadRelated(all.filter(p => p._id !== currentId));
  } catch (e) {}
}

// ============ RENDER PRODUCT ============
function renderProduct(item) {
  currentProduct = item;

  document.title = item.name + " | BanglarBazar";
  document.getElementById("breadcrumb-name").textContent = item.name;

  document.getElementById("shopName").textContent =
    item.shopName || item.seller || item.district + " Seller";

  document.getElementById("productName").textContent = item.name;
  document.getElementById("productSubtitle").textContent =
    item.subtitle || item.description || (item.district + " এর বিখ্যাত পণ্য");

  document.getElementById("productPrice").textContent = "৳ " + item.price;

  if (item.originalPrice && item.originalPrice > item.price) {
    const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
    document.getElementById("productOldPrice").textContent = "৳ " + item.originalPrice;
    document.getElementById("productOldPrice").style.display = "inline";
    document.getElementById("discountBadge").textContent = discount + "% off";
    document.getElementById("discountBadge").style.display = "inline";
  }

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

  document.getElementById("productDesc").textContent =
    item.description ||
    item.desc ||
    item.name + " — " + (item.district || "বাংলাদেশ") + " এর ঐতিহ্যবাহী পণ্য।";

  const imgSrc = getImage(item);
  document.getElementById("mainProductImg").src = imgSrc;

  const thumbRow = document.getElementById("thumbRow");
  thumbRow.innerHTML = "";

  const allImages = item.images && item.images.length > 0
    ? item.images
    : [imgSrc, imgSrc, imgSrc];

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

  document.getElementById("loadingState").style.display = "none";
  document.getElementById("detailCard").style.display = "grid";

  loadAllProducts(item._id);

  // 🔥 CHANGE 2: cart count sync on load
  updateCartCount();
}

// ============ RELATED ============
function loadRelated(products) {
  if (!products || products.length === 0) return;

  const grid = document.getElementById("relatedGrid");
  grid.innerHTML = "";

  const show = products.slice(0, 6);

  show.forEach(item => {
    const card = document.createElement("div");
    card.className = "related-card";

    card.innerHTML = `
      <img src="${getImage(item)}" alt="${item.name}">
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

// ============ IMAGE ============
function getImage(item) {
  if (!item.image) return "images/default.png";
  if (item.image.startsWith("http")) return item.image;
  return `${BASE_URL}/uploads/${item.image}`;
}

// ============ QTY ============
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

  showToast(qty + " item " + currentProduct.name + " Added to cart!");

  // 🔥 CHANGE 3: cart update call
  updateCartCount();
}

// ============ BUY ============
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
    <p style="color:#c0392b;">⚠️ ${msg}</p>
    <a href="index.html">← Home</a>
  `;
}

// ============ INIT ============
loadProduct();

// 🔥 CHANGE 4: page load cart sync
document.addEventListener("DOMContentLoaded", updateCartCount);