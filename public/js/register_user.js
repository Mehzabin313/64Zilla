/*document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const registerBtn = document.getElementById("register-btn");

    registerBtn.addEventListener("click", function () {
        const fullName = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const password = form.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

        // Check all fields
        if (!fullName || !email || !password || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        // Email validation
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!email.match(emailPattern)) {
            alert("Enter a valid email.");
            return;
        }

        // Password validation
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
        if (!password.match(passwordPattern)) {
            alert("Password must contain:\n- 1 uppercase\n- 1 number\n- 1 special char\n- Min 6 chars");
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // SUCCESS
        alert("Registration successful!");
        form.reset();

        // Redirect to home page
        window.location.href = "home.html"; // Change file name if needed
    });
});*/
const BASE_URL = "https://six4zilla.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.status === 201 || result.success) {
            alert("Registration Successful");
            window.location.href = "login.html";
        } else {
            alert("Error: " + result.message);
        }
    });

});