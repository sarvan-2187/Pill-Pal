function handleSignup() {
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const loading = document.getElementById('loading');
    
    if (!fullName || !email || !newUsername || !newPassword || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    const passwordPattern = /^[A-Za-z0-9@#*]+$/;
    if (!passwordPattern.test(newPassword)) {
        alert('Password can only contain alphabets, digits, @, #, *');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    let users = localStorage.getItem('users');
    users = users ? JSON.parse(users) : {};
    
    if (users[newUsername]) {
        alert('Username already exists!');
    } else {
        loading.style.display = 'block';
        setTimeout(() => {
            users[newUsername] = { fullName: fullName, email: email, password: newPassword, redirect: "dashboard.html" };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Signup Successful! You can now login.');
            window.location.href = "login.html";
        }, 2000);
    }
}