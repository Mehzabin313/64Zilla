const sellerId = localStorage.getItem("sellerId");
const BASE_URL = "https://six4zilla.onrender.com";

// ================= LOAD DATA =================
async function loadSeller() {
    try {
        const res = await fetch(`${BASE_URL}/seller/${sellerId}`);
        const data = await res.json();

        document.getElementById("name").value = data.username || "";
        document.getElementById("storeName").value = data.storeName || "";
        document.getElementById("district").value = data.district || "";

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }
}

// ================= SAVE DATA =================
async function save() {
    try {
        const updated = {
            username: document.getElementById("name").value,
            storeName: document.getElementById("storeName").value,
            district: document.getElementById("district").value
        };

        const res = await fetch(`${BASE_URL}/seller/${sellerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updated)
        });

        const data = await res.json();

        if (data.success) {
            alert("Profile Updated Successfully!");
            window.location.href = "seller-profile.html";
        } else {
            alert("Update failed!");
        }

    } catch (err) {
        console.log("SAVE ERROR:", err);
    }
}

loadSeller();