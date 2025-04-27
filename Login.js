// Password visibility toggle function
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = 'https://cdn-icons-png.flaticon.com/512/2767/2767194.png';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png';
    }
} 