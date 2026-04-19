// Product data
/*const products = [
  { name: "Chomchom",  image: "images/Tangail-Chomchom.jpg" },
  { name: "Jamdani Saree",  image: "images/jamdani.jpeg" },
  { name: "Nakshi Kantha", image: "images/nokshikatha.jpg" },
  { name: "Rajsahi Am", image: "images/rajsahi am.jpeg" },
  { name: "Bogur Doi", image: "images/mistydoi.jpg" },
  { name: "Norshindi Lotkon", image: "images/lotkon.jpeg" }
];

// Get container
const container = document.getElementById("product-container");

// Loop through products and display dynamically
products.forEach(product => {
  const col = document.createElement("div");
  col.classList.add("col-md-2", "col-6");

  col.innerHTML = `
    <div class="product-card text-center">
      <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
      <h6>${product.name}</h6>
     
    </div>
  `;

  container.appendChild(col);
});*/
//container2
/*const product2 = [
  { name: "Chomchom",  image: "images/Tangail-Chomchom.jpg", district:"Tangail", weight:"500gm", price:"200"},
  { name: "Jamdani Saree",  image: "images/jamdani.jpeg", district:"Dhaka",weight:"1 Piece",price:"10k" },
  { name: "Nakshi Kantha", image: "images/nokshikatha.jpg", district:"Bogra", weight:"1 Piece",price:"3000"},
  { name: "Rajsahi Am", image: "images/rajsahi am.jpeg", district:"Rajshahi", weight:"1kg" ,price:"100"},
  { name: "Bogur Doi", image: "images/mistydoi.jpg", district:"Bogra",weight:"1kg",price:"500" },
  { name: "Norshindi Lotkon", image: "images/lotkon.jpeg", district:"Norshindi", weight:"1kg",price:"400"}
];

// দ্বিতীয় container element
const container2 = document.getElementById('container2');

product2.forEach((item,index) => {
  const row = document.createElement("div");
  row.classList.add("col-md-2", "col-6");

row.innerHTML = `
  <div class="product-card text-center">

    <!-- CLICKABLE AREA (quantity-এর আগ পর্যন্ত) -->
    <div 
      class="product-click-area"
      onclick="window.location.href='container.html'"
    >
      <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
      <h6>${item.name}</h6>
      <h6>${item.district}</h6>
      <h6 class="weight-text">${item.weight}</h6>
      <h6>৳ ${item.price}</h6>
    </div>

    <!-- NON CLICKABLE AREA -->
    <div class="qty-box">
      <button class="qty-btn" id="minus-${index}">-</button>
      <span id="count-${index}">0</span>
      <button class="qty-btn" id="plus-${index}">+</button>
    </div>

    <button 
      class="add-cart-btn"
     >
      Add to Cart
    </button>

  </div>
`;

  container2.appendChild(row);
  let count = 0;

  // Buttons and count span references
  const plusBtn = document.getElementById(`plus-${index}`);
  const minusBtn = document.getElementById(`minus-${index}`);
  const countSpan = document.getElementById(`count-${index}`);

  plusBtn.addEventListener('click', () => {
    count++;
    countSpan.textContent = count;
  });

  minusBtn.addEventListener('click', () => {
    if (count > 0) {
      count--;
      countSpan.textContent = count;
    }
  });
});
//container2
const product4 = [
  { name: "Chomchom",  image: "images/Tangail-Chomchom.jpg", district:"Tangail", weight:"500gm", price:"250"},
  { name: "Jamdani Saree",  image: "images/jamdani.jpeg", district:"Dhaka",weight:"1 Piece",price:"10k" },
  { name: "Nakshi Kantha", image: "images/nokshikatha.jpg", district:"Bogra", weight:"1 Piece",price:"3000"},
  { name: "Rajsahi Am", image: "images/rajsahi am.jpeg", district:"Rajshahi", weight:"1kg" ,price:"100"},
  { name: "Bogur Doi", image: "images/mistydoi.jpg", district:"Bogra",weight:"1kg",price:"500" },
  { name: "Norshindi Lotkon", image: "images/lotkon.jpeg", district:"Norshindi", weight:"1kg",price:"400"}
];

// দ্বিতীয় container element
const container4 = document.getElementById('container4');

product4.forEach((item,index) => {
  const row4 = document.createElement("div");
  row4.classList.add("col-md-2", "col-6");

  row4.innerHTML = `
    <div class="product-card text-center">
      <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
      <h6>${item.name}</h6>
       <h6>${item.district}</h6>
   <h6 class="weight-text">${item.weight}</h6>
 <h6>৳ ${item.price}</h6>
  <div class="qty-box">
        <button class="qty-btn" id="minus-${index}">-</button>
        <span  id="count-${index}">0</span>
        <button class="qty-btn" id="plus-${index}">+</button>
      </div>
<button 
      class="add-cart-btn"
     >
      Add to Cart
    </button>
    </div>
  `;

  container4.appendChild(row4);
  let count = 0;

  // Buttons and count span references
  const plusBtn = document.getElementById(`plus-${index}`);
  const minusBtn = document.getElementById(`minus-${index}`);
  const countSpan = document.getElementById(`count-${index}`);

  plusBtn.addEventListener('click', () => {
    count++;
    countSpan.textContent = count;
  });

  minusBtn.addEventListener('click', () => {
    if (count > 0) {
      count--;
      countSpan.textContent = count;
    }
  });
});*/
document.addEventListener("DOMContentLoaded", () => {

  const products = [

  // 🍬 SWEETS
  { name: "Chomchom", image: "images/Tangail-Chomchom.jpg", category: "sweets" },
  { name: "Bogura Doi", image: "images/mistydoi.jpg", category: "sweets" },
  { name: "Roshogolla", image: "images/roshogolla.jpg", category: "sweets" },
  { name: "Kalojam", image: "images/kalojam.jpg", category: "sweets" },
  { name: "Laddu", image: "images/laddu.jpg", category: "sweets" },

  // 👗 CLOTHES
  { name: "Jamdani Saree", image: "images/jamdani.jpeg", category: "clothes" },
  { name: "Cotton Saree", image: "images/cotton-saree.jpg", category: "clothes" },
  { name: "Silk Saree", image: "images/silksaree.jpg", category: "clothes" },
  { name: "Panjabi", image: "images/panjabi.webp", category: "clothes" },
  { name: "Three Piece", image: "images/three.webp", category: "clothes" },

  // 🎨 CRAFTS
  { name: "Nakshi Kantha", image: "images/nokshikatha.jpg", category: "crafts" },
  { name: "Clay Pot", image: "images/claypot.jpg", category: "crafts" },
  { name: "Handmade Bag", image: "images/handbag.jpg", category: "crafts" },
  { name: "Wooden Art", image: "images/woodart.jpg", category: "crafts" },
  { name: "Bamboo Basket", image: "images/bambo.jpg", category: "crafts" },

  // 🍎 FRUITS
  { name: "Rajsahi Mango", image: "images/rajsahi am.jpeg", category: "fruits" },
  { name: "Narsingdi Lotkon", image: "images/lotkon.jpeg", category: "fruits" },
  { name: "Banana", image: "images/banana.jpg", category: "fruits" },
  { name: "Pineapple", image: "images/pinaapple.jpg", category: "fruits" },
  { name: "Guava", image: "images/guava.jpg", category: "fruits" }

];

  const container = document.getElementById("product-container");
  const buttons = document.querySelectorAll(".cat-btn");

  // 🔥 display function
  function displayProducts(filteredProducts) {
    container.innerHTML = "";

    filteredProducts.forEach(product => {
      const col = document.createElement("div");
      col.classList.add("col-md-2", "col-6");

      col.innerHTML = `
        <div class="product-card text-center">
          <img src="${product.image}" class="img-fluid rounded" width="120">
          <h6>${product.name}</h6>
        </div>
      `;

      container.appendChild(col);
    });
  }

  // 🔥 default load
  displayProducts(products);

  // 🔥 category click
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      // active class
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      if (category === "all") {
        displayProducts(products);
      } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
      }

    });
  });

});