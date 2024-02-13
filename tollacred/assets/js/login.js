// login.js

const baseURL = 'https://p4u9i76s6f.execute-api.us-east-1.amazonaws.com';

async function makeRequest(method, url, data = null) {
    try {
        const response = await axios({
            method,
            url: `${baseURL}/${url}`,
            data
        });
        return response.data;
    } catch (error) {
        console.error('Error making request:', error.message);
        throw error;
    }
}

async function loginUser(username, password) {
    const loginEndpoint = 'auth/login';

    try {
        const response = await makeRequest('POST', loginEndpoint, { username, password });
        console.log('Login successful:', response);

        // Redirect or perform any action upon successful login
    } catch (error) {
        console.error('Login failed:', error.message);
        // Handle login failure, show error message, etc.
    }
}

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
