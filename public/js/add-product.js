const form = document.getElementById('addProductForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sellerId = localStorage.getItem('sellerId');
    const formData = new FormData();

    formData.append('name', document.getElementById('name').value);
    formData.append('district', document.getElementById('district').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('size', document.getElementById('size').value);
    formData.append('availability', document.getElementById('availability').value);
    formData.append('sellerId', sellerId);
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const res = await fetch('http://localhost:3000/add-product', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            alert('Product added successfully');
            window.location.href = 'seller-dashboard.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(err.message);
    }
});