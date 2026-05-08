

document.addEventListener('DOMContentLoaded', function() {
  
    const sellerregistryBtn = document.querySelector('#seller-regis');
    if(sellerregistryBtn){
        sellerregistryBtn.addEventListener('click', function() {
            window.location.href = 'seller-register.html';
        });
    }
    document.getElementById('sellerRegForm').addEventListener('submit', async (e) => {
    e.preventDefault();

   
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nid = document.getElementById('nid').value;
    const district = document.getElementById('district').value;
    const productCategory = document.getElementById('productCategory').value;

    try {
        const response = await fetch('https://six4zilla.onrender.com/register-seller', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username, 
                email, 
                password, 
                nid, 
                district, 
                productCategory 
            })
        });

        const result = await response.json();

        if (result.success) {
            alert("Register successfull!");
            window.location.href = 'seller-login.html'; 
        } else {
            alert("error: " + result.message);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("server error!");
    }
});
})