
document.addEventListener("DOMContentLoaded", async () => {

  const BASE_URL = "https://six4zilla.onrender.com";

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cart-count");
  const orderReview = document.getElementById("order-review");
  const cartBtn = document.getElementById("cart");
  const productList = document.getElementById("productList");

  // =========================
  // LOAD PRODUCTS
  // =========================
  async function loadTangailProducts() {

    try {

      const res = await fetch(`${BASE_URL}/products`);
      const products = await res.json();

      const tangailProducts = products.filter(item =>
        item.district &&
        item.district.toLowerCase().includes("tangail")
      );

      productList.innerHTML = "";

      if (tangailProducts.length === 0) {

        productList.innerHTML = `
          <p style="padding:20px;">No Tangail products found</p>
        `;

        return;
      }

      tangailProducts.forEach(item => {

        const image = item.image
          ? (item.image.startsWith("http")
              ? item.image
              : `${BASE_URL}/uploads/${item.image}`)
          : "images/default.png";

        const card = document.createElement("div");

        card.className = "product-card";

        card.style.cssText = `
          min-width:160px;
          border-radius:18px;
          padding:10px;
          text-align:center;
          color:#0a4d20;
          flex-shrink:0;
          transition:0.3s;
          background:rgba(255,255,255,0.6);
          cursor:pointer;
        `;

        card.innerHTML = `

          <img 
            src="${image}" 
            style="
              width:100%;
              height:200px;
              object-fit:cover;
              border-radius:10px;
            "
            onerror="this.src='images/default.png'"
          >

          <div style="padding:12px;">

            <h4 style="
              font-size:17px;
              color:#02532B;
              margin-bottom:8px;
            ">
              ${item.name}
            </h4>

            <p style="
              color:gray;
              font-size:14px;
              margin-bottom:6px;
            ">
              ${item.district || ""}
            </p>

            <p style="
              font-size:14px;
              margin-bottom:10px;
            ">
              ${item.weight || ""}
            </p>

            <h3 style="
              font-size:15px;
              font-weight:600;
              color:#1a5d1a;
              margin:5px 0;
            ">
              ৳ ${item.price}
            </h3>

            <!-- QTY -->
            <div style="
              display:flex;
              align-items:center;
              justify-content:center;
              gap:10px;
              margin-bottom:12px;
            ">

              <button class="minusBtn"
                style="
                  width:30px;
                  height:30px;
                  border:none;
                  background:#eee;
                  border-radius:5px;
                  cursor:pointer;
                "
              >-</button>

              <span class="qtyValue">1</span>

              <button class="plusBtn"
                style="
                  width:30px;
                  height:30px;
                  border:none;
                  background:#eee;
                  border-radius:5px;
                  cursor:pointer;
                "
              >+</button>

            </div>

            <!-- ADD TO CART -->
            <button class="addCartBtn"
              style="
                width:100%;
                padding:10px;
                border:none;
                background-color:#96D85D;
                color:#02532B;
                border-radius:8px;
                cursor:pointer;
                font-weight:bold;
              "
            >
              Add To Cart
            </button>

          </div>
        `;

        // =====================
        // CARD CLICK
        // =====================
        card.addEventListener("click", () => {

          window.location.href =
            `product-detail.html?id=${item._id}`;

        });

        // =====================
        // QTY
        // =====================
        let qty = 1;

        const qtyValue = card.querySelector(".qtyValue");

        card.querySelector(".plusBtn")
          .addEventListener("click", (e) => {

            e.stopPropagation();

            qty++;

            qtyValue.textContent = qty;

        });

        card.querySelector(".minusBtn")
          .addEventListener("click", (e) => {

            e.stopPropagation();

            if (qty > 1) {
              qty--;
            }

            qtyValue.textContent = qty;

        });

        // =====================
        // ADD TO CART
        // =====================
        card.querySelector(".addCartBtn")
          .addEventListener("click", (e) => {

            e.stopPropagation();

            const existingItem =
              cartItems.find(p => p._id === item._id);

            if (existingItem) {

              existingItem.quantity += qty;

            } else {

              cartItems.push({
                _id: item._id,
                name: item.name,
                price: item.price,
                district: item.district,
                weight: item.weight,
                image: image,
                quantity: qty
              });

            }

            localStorage.setItem(
              "cart",
              JSON.stringify(cartItems)
            );

            updateCartCount();

            renderCart();

            orderReview.style.display = "block";

            alert("Added to cart");

        });

        productList.appendChild(card);

      });

    } catch (err) {

      console.log(err);

      productList.innerHTML = `
        <p style="padding:20px;color:red;">
          Product load failed
        </p>
      `;
    }
  }

  // =========================
  // UPDATE CART COUNT
  // =========================
  function updateCartCount() {

    let totalCart = 0;

    cartItems.forEach(item => {

      totalCart += item.quantity;

    });

    cartCount.textContent = totalCart;
  }

  // =========================
  // RENDER CART
  // =========================
  function renderCart() {

    orderReview.innerHTML = "";

    if (cartItems.length === 0) {

      orderReview.innerHTML = `
        <p style="text-align:center;">
          Cart is empty
        </p>
      `;

      return;
    }

    let totalPrice = 0;

    cartItems.forEach((item, index) => {

      const itemTotal =
        item.price * item.quantity;

      totalPrice += itemTotal;

      const div = document.createElement("div");

      div.innerHTML = `

        <div style="
          display:flex;
          gap:10px;
          margin-bottom:15px;
          background:#f5f5f5;
          padding:10px;
          border-radius:10px;
        ">

          <img
            src="${item.image}"
            style="
              width:60px;
              height:60px;
              object-fit:cover;
              border-radius:8px;
            "
          >

          <div style="flex:1;">

            <h5 style="
              color:#02532B;
              margin-bottom:5px;
            ">
              ${item.name}
            </h5>

            <p style="font-size:13px;">
              Qty: ${item.quantity}
            </p>

            <p style="
              color:#1D9E75;
              font-weight:bold;
            ">
              ৳ ${itemTotal}
            </p>

            <div style="
              display:flex;
              gap:5px;
              margin-top:5px;
            ">

              <button onclick="plusItem(${index})">
                +
              </button>

              <button onclick="minusItem(${index})">
                -
              </button>

              <button onclick="removeItem(${index})">
                Remove
              </button>

            </div>

          </div>

        </div>
      `;

      orderReview.appendChild(div);

    });

    // TOTAL + CHECKOUT
    const totalDiv = document.createElement("div");

    totalDiv.innerHTML = `

      <h3 style="
        margin-top:15px;
        color:#02532B;
      ">
        Total: ৳ ${totalPrice}
      </h3>

      <button id="checkoutBtn"
        style="
          width:100%;
          margin-top:10px;
          padding:12px;
          background:#96D85D;
          border:none;
          color:white;
          border-radius:8px;
          font-size:16px;
          cursor:pointer;
        "
      >
        Checkout
      </button>
    `;

    orderReview.appendChild(totalDiv);

    document
      .getElementById("checkoutBtn")
      .addEventListener("click", () => {

        window.location.href = "checkout.html";

    });

  }

  // =========================
  // GLOBAL FUNCTIONS
  // =========================
  window.plusItem = function(index) {

    cartItems[index].quantity++;

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

    updateCartCount();

    renderCart();

  };

  window.minusItem = function(index) {

    if (cartItems[index].quantity > 1) {

      cartItems[index].quantity--;

    } else {

      cartItems.splice(index, 1);

    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

    updateCartCount();

    renderCart();

  };

  window.removeItem = function(index) {

    cartItems.splice(index, 1);

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

    updateCartCount();

    renderCart();

  };

  // =========================
  // TOGGLE CART
  // =========================
  cartBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    if (orderReview.style.display === "block") {

      orderReview.style.display = "none";

    } else {

      renderCart();

      orderReview.style.display = "block";

    }

  });

  // =========================
  // OUTSIDE CLICK CLOSE
  // =========================
  document.addEventListener("click", (e) => {

    if (
      !orderReview.contains(e.target) &&
      !cartBtn.contains(e.target)
    ) {

      orderReview.style.display = "none";

    }

  });

  // =========================
  // INIT
  // =========================
  updateCartCount();

  renderCart();

  loadTangailProducts();

});
