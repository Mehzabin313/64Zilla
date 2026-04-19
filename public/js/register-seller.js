

document.addEventListener('DOMContentLoaded', function() {
    // For index.html LOGIN button
    const sellerregistryBtn = document.querySelector('#seller-regis');
    if(sellerregistryBtn){
        sellerregistryBtn.addEventListener('click', function() {
            window.location.href = 'seller-register.html';
        });
    }
    document.getElementById('sellerRegForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // এইচটিএমএল থেকে ভ্যালুগুলো নেওয়া
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nid = document.getElementById('nid').value;
    const district = document.getElementById('district').value;
    const productCategory = document.getElementById('productCategory').value;

    try {
        const response = await fetch('http://localhost:3000/register-seller', {
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
            alert("সেলার রেজিস্ট্রেশন সফল হয়েছে!");
            window.location.href = 'seller-login.html'; // সাকসেস হলে লগইন পেজে পাঠাবে
        } else {
            alert("এরর: " + result.message);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("সার্ভার কানেক্ট হচ্ছে না রে!");
    }
});
})