const stores = [
    { name: "GreenGrocer", logo: "images/images.jpeg", color: "#bff542" },
    { name: "FreshBasket", logo: "images/images2.png", color: "#44b6e0ff" },
    { name: "UrbanMart",   logo: "images/img3.jpg", color: "#f57a99ff" },
    { name: "NatureHub",   logo: "images/img4.jpg", color: "#4a078dff" }
];

const grid = document.getElementById("store-grid");

stores.forEach(store => {
    const card = document.createElement("div");
    card.className = "store-card";

    // top color bar
    const top = document.createElement("div");
    top.className = "store-top";
    top.style.background = store.color;
    card.appendChild(top);

    // logo circle
    const logo = document.createElement("div");
    logo.className = "store-logo";

    if (store.logo) {
        const img = document.createElement("img");
        img.src = store.logo;
        img.alt = store.name + " logo";
        logo.appendChild(img);
    } else {
        logo.textContent = store.name.charAt(0);
    }

    card.appendChild(logo);

    // name area
    const body = document.createElement("div");
    body.className = "store-body";

    const name = document.createElement("h3");
    name.className = "store-name";
    name.textContent = store.name;

    body.appendChild(name);
    card.appendChild(body);

    grid.appendChild(card);
});
