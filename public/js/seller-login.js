document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sellerLoginForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('https://six4zilla.onrender.com/seller-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                      localStorage.setItem("sellerId", data.seller._id);
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