/*const id = new URLSearchParams(window.location.search).get("id");
const BASE_URL = "https://six4zilla.onrender.com";
// ================= LOAD =================
async function loadData() {

  const res = await fetch(`${BASE_URL}/product/${id}`);
  const data = await res.json();

  document.getElementById("name").value = data.name;
  document.getElementById("price").value = data.price;
  document.getElementById("district").value = data.district || "";
  document.getElementById("size").value = data.size || "";
  document.getElementById("availability").value = data.availability || "";
}

loadData();

// ================= UPDATE =================
async function updateProduct() {

  const formData = new FormData();
 
  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("district", document.getElementById("district").value);
  formData.append("size", document.getElementById("size").value);
  formData.append("availability", document.getElementById("availability").value);

  const file = document.getElementById("image").files[0];
  if (file) {
    formData.append("image", file);
  }

  await fetch(`${BASE_URL}/update-product/${id}`, {
    method: "PUT",
    body: formData
  });

  alert("Updated Successfully");
  window.location.href = "seller-dashboard.html";
}*/
const BASE_URL = "https://six4zilla.onrender.com";

// ================= GET ID =================
const id = new URLSearchParams(window.location.search).get("id");

console.log("EDIT ID:", id);

// ================= LOAD PRODUCT =================
async function loadProduct() {
    try {
        if (!id) {
            alert("Product ID missing");
            return;
        }

        const res = await fetch(`${BASE_URL}/product/${id}`);
        const data = await res.json();

        console.log("PRODUCT:", data);

        if (!data || !data._id) {
            alert("Product not found");
            return;
        }

        // populate form
        document.getElementById("name").value = data.name || "";
        document.getElementById("price").value = data.price || "";
        document.getElementById("district").value = data.district || "";
        document.getElementById("size").value = data.size || "";
        document.getElementById("availability").value = data.availability || "";

    } catch (err) {
        console.log(err);
        alert("Error loading product");
    }
}

loadProduct();

// ================= UPDATE PRODUCT =================
async function updateProduct() {

    try {
        const formData = new FormData();

        formData.append("name", document.getElementById("name").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("district", document.getElementById("district").value);
        formData.append("size", document.getElementById("size").value);
        formData.append("availability", document.getElementById("availability").value);

        const file = document.getElementById("image").files[0];

        if (file) {
            formData.append("image", file);
        }

        const res = await fetch(`${BASE_URL}/update-product/${id}`, {
            method: "PUT",
            body: formData
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error("Update failed");
        }

        alert("Product updated successfully");
        window.location.href = "seller-dashboard.html";

    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}