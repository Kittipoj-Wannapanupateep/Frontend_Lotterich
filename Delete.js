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

    // Add event listeners for password toggle button
    document.querySelector('.toggle-password').addEventListener('click', function() {
        const inputId = this.getAttribute('data-input');
        const iconId = this.getAttribute('data-icon');
        togglePassword(inputId, iconId);
    });

    // Handle form submission
    const deleteAccountButton = document.querySelector('.delete-account-button');
    const cancelButton = document.querySelector('.cancel-button');

    deleteAccountButton.addEventListener('click', function() {
        const confirmText = document.getElementById('confirmText').value;
        const currentPassword = document.getElementById('currentPassword').value;

        // Basic validation
        if (!confirmText || !currentPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (confirmText !== 'CONFIRM') {
            alert('Please type "CONFIRM" exactly as shown to proceed');
            return;
        }

        // Here you would typically make an API call to delete the account
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            console.log('Deleting account...');
            // Add your account deletion logic here
            alert('Account deleted successfully!');
            // Redirect to home page or login page after deletion
            window.location.href = 'index.html';
        }
    });

    cancelButton.addEventListener('click', function() {
        // Clear all fields
        document.getElementById('confirmText').value = '';
        document.getElementById('currentPassword').value = '';
        // Redirect back to profile or home page
        window.location.href = 'profile.html';
    });
});
