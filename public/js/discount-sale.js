document.addEventListener("DOMContentLoaded", () => {
  const data = [
    {
      percent: "20%",
      bg: "#FFDD57",
      pColor: "#C62828",
      tColor: "#8E0000",
      img: "images/dis2.avif"
    },
    {
      percent: "30%",
      bg: "#B8FF5C",
      pColor: "#027717",
      tColor: "#013C0C",
      img: "images/dis5.avif"
    },
    {
      percent: "50%",
      bg: "#C62828",
      pColor: "#FFEB3B",
      tColor: "#FFE07A",
      img: "images/dis4.avif"
    },
    {
      percent: "10%",
      bg: "#002F66",
      pColor: "#B3E5FF",
      tColor: "#E6F7FF",
      img: "images/dis3.avif"
    }
  ];

  const container = document.getElementById("container3");
  if (!container) {
    console.error("container3 not found in DOM");
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.background = item.bg;

    card.innerHTML = `
      <h1 style="color:${item.pColor}">${item.percent}</h1>

      <p style="color:${item.tColor}">
        Enjoy Discount over 3 items
      </p>

      <img 
        src="${item.img}" 
        alt="Offer Image"
        style="
          width: 200px;
          height: 150px;
          object-fit: contain;
          margin-top: 10px;
        "
      >
    `;

    container.appendChild(card);
  });
});
