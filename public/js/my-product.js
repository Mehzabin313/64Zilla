document.addEventListener("DOMContentLoaded", async () => {

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
    const res = await fetch('http://localhost:3000/products');
    const products = await res.json();

    container2.innerHTML = "";

    products.forEach((item, index) => {

      const row = document.createElement("div");
      row.classList.add("col-md-2", "col-6");

      row.innerHTML = `
        <div class="product-card text-center">
          <img src="http://localhost:3000/uploads/${item.image}" class="img-fluid rounded">
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
          <img src="http://localhost:3000/uploads/${item.image}" width="50">
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

});