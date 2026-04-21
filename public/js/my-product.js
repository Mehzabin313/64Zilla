/*document.addEventListener("DOMContentLoaded", async () => {

  let totalCart = 0;
  let cartItems = [];

  const cartCount = document.getElementById("cart-count");
  const orderReview = document.getElementById("order-review");
  const cartDiv = document.getElementById("cart");
  

  const productTable = document.getElementById('productTable');
  if (!productTable) return;

  // 🔥 CLOSE BUTTON ADD
  orderReview.innerHTML = `
    <div style="text-align:right;">
      <button id="close-cart" style="border:none;background:none;font-size:18px;cursor:pointer;">❌</button>
    </div>
  `;

  try {
    const res = await fetch('https://six4zilla.onrender.com/products');
    const products = await res.json();

    container2.innerHTML = "";

    products.forEach((item, index) => {

      const row = document.createElement("div");
      row.classList.add("col-md-2", "col-6");

      row.innerHTML = `
        <div class="product-card text-center">
          <img src="https://six4zilla.onrender.com/uploads/${item.image}" class="img-fluid rounded">
          <h6>${item.name}</h6>
          <h6>${item.district}</h6>
          <h6>${item.size || ''}</h6>
          <h6>৳ ${item.price}</h6>

          <div class="qty-box">
            <button class="qty-btn" id="minus-${index}">-</button>
            <span id="count-${index}">0</span>
            <button class="qty-btn" id="plus-${index}">+</button>
          </div>

          <button id="add-${index}" class="add-cart-btn">Add to Cart</button>
        </div>
      `;

      container2.appendChild(row);

      let count = 0;

      const plusBtn = document.getElementById(`plus-${index}`);
      const minusBtn = document.getElementById(`minus-${index}`);
      const countSpan = document.getElementById(`count-${index}`);
      const addBtn = document.getElementById(`add-${index}`);

      plusBtn.addEventListener("click", () => {
        count++;
        countSpan.textContent = count;
      });

      minusBtn.addEventListener("click", () => {
        if (count > 0) {
          count--;
          countSpan.textContent = count;
        }
      });

      addBtn.addEventListener("click", () => {

        let finalQty = count === 0 ? 1 : count;

        let existingItem = cartItems.find(p => p._id === item._id);

        if (existingItem) {
          existingItem.quantity += finalQty;
        } else {
          cartItems.push({
            ...item,
            quantity: finalQty
          });
        }

        totalCart += finalQty;
        cartCount.textContent = totalCart;

        count = 0;
        countSpan.textContent = 0;

        renderCart();
        orderReview.style.display = "block";
      });

    });

  } catch (err) {
    console.log("Error:", err);
  }

  // ================= CART UI =================
  function renderCart() {

    // 🔥 header with close button always keep
    orderReview.innerHTML = `
      <div style="text-align:right;">
        <button id="close-cart" style="border:none;background:none;font-size:18px;cursor:pointer;">❌</button>
      </div>
    `;

    let totalPrice = 0;

    cartItems.forEach((item, index) => {

      let itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const div = document.createElement("div");

      div.innerHTML = `
        <div style="display:flex; gap:10px; margin-bottom:10px;">
          <img src="https://six4zilla.onrender.com/uploads/${item.image}" width="50">
          <div>
            <h6>${item.name}</h6>
            <p>${item.district}</p>
            <p>৳ ${itemTotal}</p>
            <button onclick="plusItem(${index})">+</button>
            <button onclick="minusItem(${index})">-</button>
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

    // 🔥 CLOSE EVENT RE-ATTACH (important)
    document.getElementById("close-cart").addEventListener("click", () => {
      orderReview.style.display = "none";
    });
  }

  // ===== GLOBAL FUNCTIONS =====
  window.plusItem = function(index) {
    cartItems[index].quantity++;
    totalCart++;
    cartCount.textContent = totalCart;
    renderCart();
  };

  window.minusItem = function(index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
      totalCart--;
    } else {
      totalCart--;
      cartItems.splice(index, 1);
    }
    cartCount.textContent = totalCart;
    renderCart();
  };

  window.removeItem = function(index) {
    totalCart -= cartItems[index].quantity;
    cartItems.splice(index, 1);
    cartCount.textContent = totalCart;
    renderCart();
  };

  // toggle cart
  cartDiv.addEventListener("click", () => {
    orderReview.style.display =
      orderReview.style.display === "block" ? "none" : "block";
  });

});*/
document.addEventListener("DOMContentLoaded", async () => {

  const BASE_URL = "https://six4zilla.onrender.com";

  let totalCart = 0;
  let cartItems = [];

  const cartCount = document.getElementById("cart-count");
  const orderReview = document.getElementById("order-review");
  const cartDiv = document.getElementById("cart");
  const container2 = document.getElementById("container2");

  if (!container2) return;

  // ================= CART TOGGLE =================
  cartDiv.addEventListener("click", () => {
    orderReview.classList.toggle("active");
  });

  // ================= FETCH PRODUCTS =================
  const res = await fetch(`${BASE_URL}/products`);
  const products = await res.json();

  function renderProducts() {

    container2.innerHTML = "";

    products.forEach((item, index) => {

      const row = document.createElement("div");
      row.classList.add("col-md-2", "col-6");

      const imgUrl = item.image
        ? `${BASE_URL}/uploads/${item.image}`
        : "images/default.png";

      row.innerHTML = `
        <div class="product-card text-center">
          <img src="${imgUrl}" class="img-fluid rounded">
          <h6>${item.name}</h6>
          <h6>${item.district}</h6>
          <h6>৳ ${item.price}</h6>

          <div>
            <button id="minus-${index}">-</button>
            <span id="count-${index}">0</span>
            <button id="plus-${index}">+</button>
          </div>

          <button id="add-${index}">Add to Cart</button>
        </div>
      `;

      container2.appendChild(row);

      let count = 0;

      document.getElementById(`plus-${index}`).onclick = () => {
        count++;
        document.getElementById(`count-${index}`).innerText = count;
      };

      document.getElementById(`minus-${index}`).onclick = () => {
        if (count > 0) count--;
        document.getElementById(`count-${index}`).innerText = count;
      };

      document.getElementById(`add-${index}`).onclick = () => {

        let qty = count === 0 ? 1 : count;

        let exist = cartItems.find(p => p._id === item._id);

        if (exist) {
          exist.quantity += qty;
        } else {
          cartItems.push({ ...item, quantity: qty });
        }

        totalCart += qty;
        cartCount.innerText = totalCart;

        count = 0;
        document.getElementById(`count-${index}`).innerText = 0;

        renderCart();
      };

    });
  }

  renderProducts();

  // ================= CART =================
  function renderCart() {

    orderReview.innerHTML = `
      <div style="text-align:right;">
        <button id="close-cart" style="border:none;background:none;font-size:18px;cursor:pointer;">❌</button>
      </div>
    `;

    let totalPrice = 0;

    cartItems.forEach((item, index) => {

      totalPrice += item.price * item.quantity;

      const div = document.createElement("div");

      div.innerHTML = `
        <div style="display:flex;gap:10px;margin-top:10px;">
          <img src="${BASE_URL}/uploads/${item.image}" width="50">
          <div>
            <h6>${item.name}</h6>
            <p>Qty: ${item.quantity}</p>
            <p>৳ ${item.price * item.quantity}</p>

            <button onclick="plusItem(${index})">+</button>
            <button onclick="minusItem(${index})">-</button>
            <button onclick="removeItem(${index})">Remove</button>
          </div>
        </div>
        <hr>
      `;

      orderReview.appendChild(div);
    });

    orderReview.innerHTML += `
      <h3>Total: ৳ ${totalPrice}</h3>
    `;

  }

  // ================= GLOBAL =================
  window.plusItem = (i) => {
    cartItems[i].quantity++;
    totalCart++;
    cartCount.innerText = totalCart;
    renderCart();
  };

  window.minusItem = (i) => {
    if (cartItems[i].quantity > 1) {
      cartItems[i].quantity--;
      totalCart--;
    } else {
      totalCart -= cartItems[i].quantity;
      cartItems.splice(i, 1);
    }
    cartCount.innerText = totalCart;
    renderCart();
  };

  window.removeItem = (i) => {
    totalCart -= cartItems[i].quantity;
    cartItems.splice(i, 1);
    cartCount.innerText = totalCart;
    renderCart();
  };

});