document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sellerLoginForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('http://localhost:3000/seller-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = 'seller-dashboard.html';
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Server error!");
            }
        });
    }
});