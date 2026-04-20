const id = new URLSearchParams(window.location.search).get("id");

// ================= LOAD =================
async function loadData() {

  const res = await fetch(`http://localhost:3000/product/${id}`);
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

  await fetch(`https://six4zilla.onrender.com/update-product/${id}`, {
    method: "PUT",
    body: formData
  });

  alert("Updated Successfully");
  window.location.href = "seller-dashboard.html";
}