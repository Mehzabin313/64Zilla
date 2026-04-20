/*const form = document.getElementById('addProductForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', document.getElementById('name').value);
    formData.append('district', document.getElementById('district').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('size', document.getElementById('size').value);
    formData.append('availability', document.getElementById('availability').value);

    // optional sellerId
    formData.append('sellerId', '123');

    formData.append('image', document.getElementById('image').files[0]);

    const res = await fetch('http://localhost:3000/add-product', {
        method: 'POST',
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        alert("Product Added!");
        console.log(data);
    } else {
        alert("Error: " + data.error);
    }
});
//
const sellerId = localStorage.getItem("sellerId");

const form = document.getElementById("addProductForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("sellerId", sellerId);
    formData.append("name", document.getElementById("name").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("district", document.getElementById("district").value);
    formData.append("size", document.getElementById("size").value);
    formData.append("availability", document.getElementById("availability").value);
    formData.append("image", document.getElementById("image").files[0]);

    const res = await fetch("http://localhost:3000/add-product", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (data.success) {
        alert("Product Added Successfully!");

        // 🔥 IMPORTANT: go back to dashboard
        window.location.href = "seller-dashboard.html";
    } else {
        alert("Error adding product");
    }
});
//
const sellerId = localStorage.getItem("sellerId");

const form = document.getElementById("addProductForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!sellerId) {
            alert("Seller not logged in");
            return;
        }

        const formData = new FormData();

        formData.append("sellerId", sellerId);
        formData.append("name", document.getElementById("name").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("district", document.getElementById("district").value);
        formData.append("size", document.getElementById("size").value);
        formData.append("availability", document.getElementById("availability").value);
        formData.append("image", document.getElementById("image").files[0]);

        const res = await fetch("https://six4zilla.onrender.com/add-product", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            alert("Product Added Successfully!");
            window.location.href = "seller-dashboard.html";
        } else {
            alert("Error adding product");
        }
    });
}*/
const sellerId = localStorage.getItem("sellerId");

const form = document.getElementById("addProductForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 🔴 Seller check
        if (!sellerId) {
            alert("Seller not logged in!");
            return;
        }

        // 🔴 Get values
        const name = document.getElementById("name").value.trim();
        const price = document.getElementById("price").value.trim();
        const district = document.getElementById("district").value.trim();
        const size = document.getElementById("size").value.trim();
        const availability = document.getElementById("availability").value;
        const imageFile = document.getElementById("image").files[0];

        // 🔴 Validation
        if (!name || !price || !district) {
            alert("Please fill all required fields!");
            return;
        }

        if (!imageFile) {
            alert("Please select an image!");
            return;
        }

        // 🔴 FormData
        const formData = new FormData();
        formData.append("sellerId", sellerId);
        formData.append("name", name);
        formData.append("price", price);

        // 👉 BEST PRACTICE (lowercase save)
        formData.append("district", district.toLowerCase());

        formData.append("size", size);
        formData.append("availability", availability);
        formData.append("image", imageFile);

        try {
            // 🔄 Loader (optional)
            const btn = form.querySelector("button");
            btn.innerText = "Adding...";
            btn.disabled = true;

            const res = await fetch("https://six4zilla.onrender.com/add-product", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            // 🔴 Error response
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to add product");
            }

            // ✅ Success
            alert("✅ Product Added Successfully!");

            // reset form
            form.reset();

            // redirect
            window.location.href = "seller-dashboard.html";

        } catch (err) {
            console.error(err);
            alert("❌ " + err.message);
        } finally {
            // 🔄 reset button
            const btn = form.querySelector("button");
            btn.innerText = "Add Product";
            btn.disabled = false;
        }
    });
}