// Password visibility toggle function
function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = 'https://cdn-icons-png.flaticon.com/512/2767/2767194.png';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png';
    }
} 