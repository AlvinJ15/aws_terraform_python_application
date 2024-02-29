// login.js

function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loginUser(username, password);
}

function openPasswordResetModal() {
    document.getElementById('passwordResetModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closePasswordResetModal() {
    document.getElementById('passwordResetModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function resetPassword() {
    const resetEmail = document.getElementById('resetEmail').value;

    // Implement logic to send a reset link to the email
    console.log('Password reset requested for email:', resetEmail);

    // Close the modal
    closePasswordResetModal();
}
