/*
//last final one 
document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("result-container");
   const BASE_URL = "https://six4zilla.onrender.com";
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  if (!query) {
    container.innerHTML = "<h3>No search query</h3>";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/search-products?q=${query}`);
    const products = await res.json();

    if (products.length === 0) {
      container.innerHTML = "<h3>No products found</h3>";
      return;
    }

    container.innerHTML = "";

   
    let cartItems = [];
    let totalCart = 0;

    products.forEach((item, index) => {

    const img = item.image || "images/default.png";


      container.innerHTML += `
        <div style="    min-width: 160px;
    border-radius: 18px;
    padding: 10px;
    text-align: center;
    color: #0a4d20;
    flex-shrink: 0;
    transition: 0.3s;
    background: rgba(255, 255, 255, 0.596);" id="cat-btn">
          
          <img src="${img}" width="150"> 
          <h4>${item.name}</h4>
          <p>${item.district}</p>
          <p>৳ ${item.price}</p>

          

         

        </div>
      `;
    });


    setTimeout(() => {

      products.forEach((item, index) => {

        let count = 0;

        const plusBtn = document.getElementById(`plus-${index}`);
        const minusBtn = document.getElementById(`minus-${index}`);
        const countSpan = document.getElementById(`count-${index}`);
        const addBtn = document.getElementById(`add-${index}`);

        if (!plusBtn || !minusBtn || !addBtn) return;

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
            cartItems.push({ ...item, quantity: finalQty });
          }

          totalCart += finalQty;

          count = 0;
          countSpan.textContent = 0;

          console.log("Cart:", cartItems);
        });

      });

    }, 0);

  } catch (err) {
    console.error("ERROR:", err);
    container.innerHTML = "<h3>Server error</h3>";
  }

});*/
document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("result-container");

  const BASE_URL = "https://six4zilla.onrender.com";

  if (!container) return;

  // =========================
  // GET SEARCH QUERY
  // =========================
  const urlParams = new URLSearchParams(window.location.search);

  const query = urlParams.get("q");

  if (!query) {

    container.innerHTML = "<h3>No search query</h3>";

    return;
  }

  try {

    // =========================
    // FETCH PRODUCTS
    // =========================
    const res = await fetch(
      `${BASE_URL}/search-products?q=${query}`
    );

    const products = await res.json();

    // =========================
    // NO PRODUCTS
    // =========================
    if (products.length === 0) {

      container.innerHTML =
        "<h3>No products found</h3>";

      return;
    }

    // =========================
    // CLEAR CONTAINER
    // =========================
    container.innerHTML = "";

    // =========================
    // CART
    // =========================
    let cartItems =
      JSON.parse(localStorage.getItem("cart")) || [];

    let totalCart = 0;

    // =========================
    // PRODUCT LOOP
    // =========================
    products.forEach((item, index) => {

      // =========================
      // IMAGE FIX
      // =========================
      const img = item.image
        ? item.image
        : "images/default.png";

      // =========================
      // PRODUCT CARD
      // =========================
      container.innerHTML += `

        <div 
          class="product-card"
          data-id="${item._id}"

          style="
            min-width:160px;
            border-radius:18px;
            padding:10px;
            text-align:center;
            color:#0a4d20;
            flex-shrink:0;
            transition:0.3s;
            background:rgba(255,255,255,0.596);
            cursor:pointer;
            margin:10px;
          "
        >

          <!-- PRODUCT IMAGE -->
          <img 
            src="${img}"
            width="150"
            style="
              width:100%;
              height:180px;
              object-fit:cover;
              border-radius:10px;
            "
            onerror="this.src='images/default.png'"
          >

          <!-- PRODUCT NAME -->
          <h4 style="
            margin-top:10px;
            color:#02532B;
          ">
            ${item.name}
          </h4>

          <!-- DISTRICT -->
          <p style="
            color:gray;
            font-size:14px;
          ">
            ${item.district || ""}
          </p>

          <!-- PRICE -->
          <p style="
            font-weight:bold;
            color:#1D9E75;
          ">
            ৳ ${item.price}
          </p>

          <!-- QUANTITY -->
          <div class="qty-box"
            style="
              display:flex;
              justify-content:center;
              align-items:center;
              gap:10px;
              margin-top:10px;
            "
          >

            <button 
              class="qty-btn"
              id="minus-${index}"

              style="
                width:30px;
                height:30px;
                border:none;
                background:#eee;
                border-radius:5px;
                cursor:pointer;
              "
            >
              -
            </button>

            <span id="count-${index}">
              1
            </span>

            <button 
              class="qty-btn"
              id="plus-${index}"

              style="
                width:30px;
                height:30px;
                border:none;
                background:#eee;
                border-radius:5px;
                cursor:pointer;
              "
            >
              +
            </button>

          </div>

          <!-- ADD TO CART -->
          <button 
            id="add-${index}"

            class="add-cart-btn"

            style="
              width:100%;
              margin-top:12px;
              padding:10px;
              border:none;
              background:#96D85D;
              color:white;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            Add To Cart
          </button>

        </div>
      `;
    });

    // =========================
    // WAIT FOR DOM
    // =========================
    setTimeout(() => {

      // =========================
      // PRODUCT DETAIL CLICK
      // =========================
      const cards =
        document.querySelectorAll(".product-card");

      cards.forEach(card => {

        card.addEventListener("click", () => {

          const productId =
            card.dataset.id;

          window.location.href =
            `product-detail.html?id=${productId}`;

        });

      });

      // =========================
      // QUANTITY + CART
      // =========================
      products.forEach((item, index) => {

        let count = 1;

        const plusBtn =
          document.getElementById(`plus-${index}`);

        const minusBtn =
          document.getElementById(`minus-${index}`);

        const countSpan =
          document.getElementById(`count-${index}`);

        const addBtn =
          document.getElementById(`add-${index}`);

        // =========================
        // SAFETY CHECK
        // =========================
        if (
          !plusBtn ||
          !minusBtn ||
          !addBtn
        ) return;

        // =========================
        // PLUS
        // =========================
        plusBtn.addEventListener("click", (e) => {

          // 🔥 IMPORTANT
          e.stopPropagation();

          count++;

          countSpan.textContent = count;

        });

        // =========================
        // MINUS
        // =========================
        minusBtn.addEventListener("click", (e) => {

          // 🔥 IMPORTANT
          e.stopPropagation();

          if (count > 1) {

            count--;

            countSpan.textContent = count;

          }

        });

        // =========================
        // ADD TO CART
        // =========================
        addBtn.addEventListener("click", (e) => {

          // 🔥 IMPORTANT
          e.stopPropagation();

          const existingItem =
            cartItems.find(
              p => p._id === item._id
            );

          if (existingItem) {

            existingItem.quantity += count;

          } else {

            cartItems.push({

              ...item,

              quantity: count,

              image: img
            });

          }

          // =========================
          // SAVE LOCALSTORAGE
          // =========================
          localStorage.setItem(
            "cart",
            JSON.stringify(cartItems)
          );

          totalCart += count;

          console.log("Cart:", cartItems);

          alert("Added to cart");

        });

      });

    }, 0);

  } catch (err) {

    console.error("ERROR:", err);

    container.innerHTML =
      "<h3>Server error</h3>";
  }

});