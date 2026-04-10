/*document.addEventListener("DOMContentLoaded", () => {

  let totalCart = 0;
  let cartItems = [];

  const cartCount = document.getElementById("cart-count");
  const orderReview = document.getElementById("order-review");

  const product2 = [
    { name: "Chomchom", image: "images/Tangail-Chomchom.jpg", district:"Tangail", weight:"500gm", price:250},
    { name: "Jamdani Saree", image: "images/jamdani.jpeg", district:"Dhaka", weight:"1 Piece", price:10000},
    { name: "Nakshi Kantha", image: "images/nokshikatha.jpg", district:"Bogra", weight:"1 Piece", price:3000},
    { name: "Rajsahi Am", image: "images/rajsahi am.jpeg", district:"Rajshahi", weight:"1kg", price:100},
    { name: "Bogur Doi", image: "images/mistydoi.jpg", district:"Bogra", weight:"1kg", price:500},
    { name: "Norshindi Lotkon", image: "images/lotkon.jpeg", district:"Norshindi", weight:"1kg", price:400}
  ];

  const container2 = document.getElementById('container2');
  if (!container2) return;

  product2.forEach((item, index) => {

    const row = document.createElement("div");
    row.classList.add("col-md-2", "col-6");

    row.innerHTML = `
      <div class="product-card text-center">
        <img src="${item.image}" class="img-fluid rounded">
        <h6>${item.name}</h6>
        <h6>${item.district}</h6>
        <h6>${item.weight}</h6>
        <h6>৳ ${item.price}</h6>

        <div class="qty-box">
          <button class="qty-btn" id="minus-${index}">-</button>
          <span id="count-${index}">0</span>
          <button class="qty-btn" id="plus-${index}">+</button>
        </div>

        <button id="add-${index}" class="add-cart-btn">
          Add to Cart
        </button>
      </div>
    `;

    container2.appendChild(row);

    let count = 0;

    const plusBtn = document.getElementById(`plus-${index}`);
    const minusBtn = document.getElementById(`minus-${index}`);
    const countSpan = document.getElementById(`count-${index}`);
    const addBtn = document.getElementById(`add-${index}`);

    // ➕ PLUS
    plusBtn.addEventListener("click", () => {
      count++;
      countSpan.textContent = count;
    });

    // ➖ MINUS
    minusBtn.addEventListener("click", () => {
      if (count > 0) {
        count--;
        countSpan.textContent = count;
      }
    });

    // 🛒 ADD TO CART
    addBtn.addEventListener("click", () => {

      let finalQty;

      // 🔥 default 1 যদি কিছু select না করা হয়
      if (count === 0) {
        finalQty = 1;
      } else {
        finalQty = count;
      }

      // 🔥 existing item check
      let existingItem = cartItems.find(p => p.name === item.name);

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
    });

  });

  // 🛒 SHOW CART
  function renderCart() {

    if (!orderReview) return;

    orderReview.innerHTML = "";

    let totalPrice = 0;

    cartItems.forEach((item, index) => {

      let itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <h6>${item.name}</h6>
        <p>৳ ${item.price} × ${item.quantity} = ৳ ${itemTotal}</p>

        <button onclick="plusItem(${index})">+</button>
        <button onclick="minusItem(${index})">-</button>
        <button onclick="removeItem(${index})">Remove</button>
        <hr>
      `;

      orderReview.appendChild(div);
    });

    // total price
    const totalDiv = document.createElement("h4");
    totalDiv.innerText = "Total: ৳ " + totalPrice;
    orderReview.appendChild(totalDiv);
  }

  // ➕ cart থেকে increase
  window.plusItem = function(index) {
    cartItems[index].quantity++;
    totalCart++;
    cartCount.textContent = totalCart;
    renderCart();
  };

  // ➖ cart থেকে decrease
  window.minusItem = function(index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
      totalCart--;
    } else {
      totalCart -= 1;
      cartItems.splice(index, 1);
    }
    cartCount.textContent = totalCart;
    renderCart();
  };

  // ❌ remove
  window.removeItem = function(index) {
    totalCart -= cartItems[index].quantity;
    cartItems.splice(index, 1);
    cartCount.textContent = totalCart;
    renderCart();
  };

});
document.addEventListener("DOMContentLoaded", () => {

  let totalCart = 0;
  let cartItems = [];

  const cartCount = document.getElementById("cart-count");
  const orderReview = document.getElementById("order-review");
  const cartDiv = document.getElementById("cart"); // cart icon

  const product2 = [
    { name: "Chomchom", image: "images/Tangail-Chomchom.jpg", district:"Tangail", weight:"500gm", price:250},
    { name: "Jamdani Saree", image: "images/jamdani.jpeg", district:"Dhaka", weight:"1 Piece", price:10000},
    { name: "Nakshi Kantha", image: "images/nokshikatha.jpg", district:"Bogra", weight:"1 Piece", price:3000},
    { name: "Rajsahi Am", image: "images/rajsahi am.jpeg", district:"Rajshahi", weight:"1kg", price:100},
    { name: "Bogur Doi", image: "images/mistydoi.jpg", district:"Bogra", weight:"1kg", price:500},
    { name: "Norshindi Lotkon", image: "images/lotkon.jpeg", district:"Norshindi", weight:"1kg", price:400}
  ];

  const container2 = document.getElementById('container2');
  if (!container2) return;

  product2.forEach((item, index) => {

    const row = document.createElement("div");
    row.classList.add("col-md-2", "col-6");

    row.innerHTML = `
      <div class="product-card text-center">
        <img src="${item.image}" class="img-fluid rounded">
        <h6>${item.name}</h6>
        <h6>${item.district}</h6>
        <h6>${item.weight}</h6>
        <h6>৳ ${item.price}</h6>

        <div class="qty-box">
          <button class="qty-btn" id="minus-${index}">-</button>
          <span id="count-${index}">0</span>
          <button class="qty-btn" id="plus-${index}">+</button>
        </div>

        <button id="add-${index}" class="add-cart-btn">
          Add to Cart
        </button>
      </div>
    `;

    container2.appendChild(row);

    let count = 0;

    const plusBtn = document.getElementById(`plus-${index}`);
    const minusBtn = document.getElementById(`minus-${index}`);
    const countSpan = document.getElementById(`count-${index}`);
    const addBtn = document.getElementById(`add-${index}`);

    // ➕ PLUS
    plusBtn.addEventListener("click", () => {
      count++;
      countSpan.textContent = count;
    });

    // ➖ MINUS
    minusBtn.addEventListener("click", () => {
      if (count > 0) {
        count--;
        countSpan.textContent = count;
      }
    });

    // 🛒 ADD TO CART
    addBtn.addEventListener("click", () => {

      let finalQty = count === 0 ? 1 : count;

      // 🔥 existing item check
      let existingItem = cartItems.find(p => p.name === item.name);

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
    });

  });

  // 🛒 SHOW CART
  function renderCart() {

    if (!orderReview) return;

    orderReview.innerHTML = "";

    let totalPrice = 0;

    cartItems.forEach((item, index) => {

      let itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
          <img src="${item.image}" style="width:50px; height:50px; object-fit:cover;">
          <div>
            <h6>${item.name}</h6>
            <p>District: ${item.district}</p>
            <p>Weight: ${item.weight}</p>
            <p>৳ ${item.price} × ${item.quantity} = ৳ ${itemTotal}</p>
            <button onclick="plusItem(${index})">+</button>
            <button onclick="minusItem(${index})">-</button>
            <button onclick="removeItem(${index})">Remove</button>
          </div>
        </div>
        <hr>
      `;

      orderReview.appendChild(div);
    });

    // total price
    const totalDiv = document.createElement("h4");
    totalDiv.innerText = "Total: ৳ " + totalPrice;
    orderReview.appendChild(totalDiv);
  }

  // ➕ cart থেকে increase
  window.plusItem = function(index) {
    cartItems[index].quantity++;
    totalCart++;
    cartCount.textContent = totalCart;
    renderCart();
  };

  // ➖ cart থেকে decrease
  window.minusItem = function(index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
      totalCart--;
    } else {
      totalCart -= 1;
      cartItems.splice(index, 1);
    }
    cartCount.textContent = totalCart;
    renderCart();
  };

  // ❌ remove
  window.removeItem = function(index) {
    totalCart -= cartItems[index].quantity;
    cartItems.splice(index, 1);
    cartCount.textContent = totalCart;
    renderCart();
  };

  // 🛒 cart icon click -> toggle orderReview
  if (cartDiv && orderReview) {
    cartDiv.addEventListener("click", () => {
      if (orderReview.style.display === "block") {
        orderReview.style.display = "none";
      } else {
        orderReview.style.display = "block";
      }
    });
  }

});*/