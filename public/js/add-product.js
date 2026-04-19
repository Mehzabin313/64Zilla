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
});*/
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

        const res = await fetch("http://localhost:3000/add-product", {
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
}