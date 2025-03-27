const users = {
    "TestUser": { password: "TestUser@123", redirect: "dashboard.html" },
};

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    document.querySelector('.login-btn').disabled = true;
    document.getElementById('loading').style.display = 'block';
    
    setTimeout(() => {
        if (users[username] && users[username].password === password) {
            window.location.href = users[username].redirect;
        } else {
            alert('Invalid Username or Password');
            document.querySelector('.login-btn').disabled = false;
            document.getElementById('loading').style.display = 'none';
        }
    }, 2000);
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        passwordField.type = "password";
        toggleButton.textContent = "Show";
    }
}
