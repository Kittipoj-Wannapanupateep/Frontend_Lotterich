document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('usernameInput');
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const changePasswordButton = document.querySelector('.change-password-button');
    const deleteAccountButton = document.querySelector('.delete-account-button');
    let originalUsername = usernameInput.value;

    editButton.addEventListener('click', function() {
        // Store original value
        originalUsername = usernameInput.value;
        
        // Make input editable
        usernameInput.removeAttribute('readonly');
        usernameInput.focus();
        
        // Show save and cancel buttons, hide edit button
        editButton.style.display = 'none';
        saveButton.style.display = 'flex';
        cancelButton.style.display = 'flex';
    });

    saveButton.addEventListener('click', function() {
        // Save the new username
        const newUsername = usernameInput.value.trim();
        if (newUsername) {
            // Here you would typically make an API call to save the new username
            console.log('Saving new username:', newUsername);
            
            // Make input readonly again
            usernameInput.setAttribute('readonly', 'readonly');
            
            // Show edit button, hide save and cancel buttons
            editButton.style.display = 'flex';
            saveButton.style.display = 'none';
            cancelButton.style.display = 'none';
        }
    });

    cancelButton.addEventListener('click', function() {
        // Restore original value
        usernameInput.value = originalUsername;
        
        // Make input readonly again
        usernameInput.setAttribute('readonly', 'readonly');
        
        // Show edit button, hide save and cancel buttons
        editButton.style.display = 'flex';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    });

    // Add click event for Change Password button
    changePasswordButton.addEventListener('click', function() {
        window.location.href = 'Change_Password.html';
    });

    // Add click event for Delete Account button
    deleteAccountButton.addEventListener('click', function() {
        window.location.href = 'Delete.html';
    });
});
