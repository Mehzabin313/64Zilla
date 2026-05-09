let userData = null;


async function checkUser(){
    try {
        const token = localStorage.getItem("token");

        if(!token){
            userData = null;
            return false;
        }

        const res = await fetch("https://six4zilla.onrender.com/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if(data.success){
            userData = data.user;

            // sidebar name
            const sbName = document.getElementById("sb-name");
            if(sbName){
                sbName.innerText = data.user.email || "User";
            }

            // login button → profile
            const loginBtn = document.getElementById("login-btn");
            if(loginBtn){
               loginBtn.textContent = data.user.username || "PROFILE";
                loginBtn.onclick = () => window.location.href = "profile.html";
            }

            return true;
        } else {
            userData = null;
            return false;
        }

    } catch (err) {
        console.log("AUTH ERROR:", err);
        userData = null;
        return false;
    }
}


menuBtn.addEventListener("click", async () => {

    const ok = await checkUser(); 

    if(!ok){
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    sideMenu.classList.add("active");
    overlay.style.display = "block";
});

function closeMenu(){
    sideMenu.classList.remove("active");
    overlay.style.display = "none";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    userData = null;

    const loginBtn = document.getElementById("login-btn");
    if(loginBtn){
        loginBtn.textContent = "LOGIN";
        loginBtn.onclick = () => window.location.href = "login.html";
    }

    closeMenu();

    window.location.href = "home.html";
}


window.addEventListener("load", checkUser);