document.addEventListener('DOMContentLoaded', function() {
    // Function to toggle password visibility
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

    // Add event listeners for all password toggle buttons
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('data-input');
            const iconId = this.getAttribute('data-icon');
            togglePassword(inputId, iconId);
        });
    });

    // Handle form submission
    const savePasswordButton = document.querySelector('.save-password-button');
    const cancelButton = document.getElementById('cancelButton');

    savePasswordButton.addEventListener('click', function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        // Here you would typically make an API call to change the password
        console.log('Changing password...');
        alert('Password changed successfully!');
    });

    // Handle cancel button click
    cancelButton.addEventListener('click', function() {
        // Clear all password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Navigate back to Profile page
        window.location.href = 'Profile.html';
    });
});
