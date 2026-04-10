document.addEventListener("DOMContentLoaded", () => {

  const product2 = [
    { name: "Chomchom",  image: "images/Tangail-Chomchom.jpg", district:"Tangail", weight:"500gm", price:"250"},
    { name: "Jamdani Saree",  image: "images/jamdani.jpeg", district:"Dhaka",weight:"1 Piece",price:"10k" },
    { name: "Nakshi Kantha", image: "images/nokshikatha.jpg", district:"Bogra", weight:"1 Piece",price:"3000"},
    { name: "Rajsahi Am", image: "images/rajsahi am.jpeg", district:"Rajshahi", weight:"1kg" ,price:"100"},
    { name: "Bogur Doi", image: "images/mistydoi.jpg", district:"Bogra",weight:"1kg",price:"500" },
    { name: "Norshindi Lotkon", image: "images/lotkon.jpeg", district:"Norshindi", weight:"1kg",price:"400"}
  ];

  
  const container2 = document.getElementById('product-container');

  if (!container2) return; // page e container2 na thakle crash korbe na

  product2.forEach((item,index) => {
    
    const row = document.createElement("div");
    row.classList.add("col-md-2", "col-6");

    row.innerHTML = `
      <div class="product-card text-center">
        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
        <h6>${item.name}</h6>
        <h6>${item.district}</h6>
        <h6 class="weight-text">${item.weight}</h6>
        <h6>৳ ${item.price}</h6>

        <div class="qty-box">
          <button class="qty-btn" id="c2-minus-${index}">-</button>
          <span id="c2-count-${index}">0</span>
          <button class="qty-btn" id="c2-plus-${index}">+</button>
        </div>
      </div>
    `;

    container2.appendChild(row);

    let count = 0;
    const plusBtn = document.getElementById(`c2-plus-${index}`);
    const minusBtn = document.getElementById(`c2-minus-${index}`);
    const countSpan = document.getElementById(`c2-count-${index}`);

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

});
