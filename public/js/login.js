// home.html এর স্ক্রিপ্ট অংশে
/*document.getElementById('login-btn').addEventListener('click', function() {
    window.location.href = 'login.html'; // সরাসরি লগইন পেজে পাঠাবে
});
document.getElementById('loginbtn').addEventListener('click', async () => {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
        // রোল অনুযায়ী রিডাইরেক্ট (দারাজ স্টাইল)
        if (result.role === 'admin') {
            window.location.href = 'admin-panel.html';
        } else if (result.role === 'seller') {
            window.location.href = 'seller-dashboard.html';
        } else {
            window.location.href = 'home.html'; // সাধারণ কাস্টমার
        }
    } else {
        alert("Password is incorrect!");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // পেজ রিফ্রেশ হওয়া আটকাবে

            // ইনপুট ভ্যালু সংগ্রহ
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                // সার্ভারে রিকোয়েস্ট পাঠানো
                const response = await fetch('http://localhost:3000/login', { // আপনার সার্ভার পোর্ট অনুযায়ী URL দিন
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                 
        if (data.role === 'admin') {
            window.location.href = 'admin-panel.html';
        } else if (data.role === 'seller') {
            window.location.href = 'seller-dashboard.html';
        } else {
            window.location.href = 'home.html'; // সাধারণ কাস্টমার
        }
    } else {
        alert("Password is incorrect!");
    }

            } catch (error) {
                console.error("Error during login:", error);
                alert("Server is not responding. Make sure your backend is running!");
            }
        });
    }
});
//last
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // 🔥 IMPORTANT
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {

            if (data.role === 'admin') {
                window.location.href = 'admin-panel.html';
            } else if (data.role === 'seller') {
                window.location.href = 'seller-dashboard.html';
            } else {
                window.location.href = 'home.html';
            }

        } else {
            alert("Login Failed");
        }
    });

});*/
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    // 🔥 CRITICAL FIX
    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch('https://six4zilla.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            if (data.role === 'admin') {
                window.location.href = 'admin-panel.html';
            } else if (data.role === 'seller') {
                window.location.href = 'seller-dashboard.html';
            } else {
                window.location.href = 'home.html';
            }
        } else {
            alert("Login Failed");
        }
    });

});