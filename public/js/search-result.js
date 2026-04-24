/*document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("result-container");

  // safety check
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  console.log("Query:", query);

  if (!query) {
    container.innerHTML = "<h3>No search query</h3>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/search-products?q=${query}`);
    const products = await res.json();

    console.log("Products:", products);

    if (products.length === 0) {
      container.innerHTML = "<h3>No products found</h3>";
      return;
    }

    container.innerHTML = "";

  products.forEach((item, index) => {

  const img = item.image
    ? `http://localhost:3000/uploads/${item.image}`
    : "images/default.png";

  container.innerHTML += `
    <div style="border:1px solid #ccc; padding:10px; margin:10px;">
      
      <img src="${img}" width="150">
      <h4>${item.name}</h4>
      <p>${item.district}</p>
      <p>৳ ${item.price}</p>

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
});

  } catch (err) {
    console.error("ERROR:", err);
    container.innerHTML = "<h3>Server error</h3>";
  }

});*/
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

    // 🔥 CART VARIABLES MUST BE INSIDE
    let cartItems = [];
    let totalCart = 0;

    products.forEach((item, index) => {

    const img = item.image || "images/default.png";


      container.innerHTML += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px;" id="cat-btn">
          
          <img src="${img}" width="150"> 
          <h4>${item.name}</h4>
          <p>${item.district}</p>
          <p>৳ ${item.price}</p>

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
    });

    // 🔥 IMPORTANT: wait for DOM update
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

});