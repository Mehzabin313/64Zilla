const sellerId = localStorage.getItem("sellerId");
const BASE_URL = "https://six4zilla.onrender.com";

// LOAD
async function load(){
    const res = await fetch(`${BASE_URL}/seller/${sellerId}`);
    const data = await res.json();

    document.getElementById("name").value = data.name || "";
    document.getElementById("storeName").value = data.storeName || "";
    document.getElementById("district").value = data.district || "";
}

load();

// SAVE
async function save(){
    await fetch(`${BASE_URL}/seller/${sellerId}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            name: document.getElementById("name").value,
            storeName: document.getElementById("storeName").value,
            district: document.getElementById("district").value
        })
    });

    alert("Profile Updated");
    window.location.href = "seller-profile.html";
}