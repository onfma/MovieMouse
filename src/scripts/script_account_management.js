function createAccount() {
    const username = document.getElementById('usernameField').value;
    const email = document.getElementById('emailField').value;
    const password = document.getElementById('passwordField').value;
  
    const accountData = { username, email, password };
  
    fetch('http://localhost:3000/add-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    })
      .then((response) => response.text())
      .then((data) => {
        const messageElement = document.getElementById('errorMessage');
        if (data === 'Account inserted successfully') {
          messageElement.textContent = 'Account created successfully';
          messageElement.style.color = 'green';
        } else {
            messageElement.textContent = 'An account with the same username or email already exists';
            messageElement.style.color = 'red';
        }
      })
      .catch((error) => {
        throw new Error('Unknown response');
      });

}
function login() {
    const email = document.getElementById('emailField').value;
    const password = document.getElementById('passwordField').value;
    
    const accountData = { email, password };
    
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === 'Login successful') {
          window.location.href = './homepage.html';
        } else {
          const messageElement = document.getElementById('errorMessage');
          messageElement.textContent = 'Invalid email or password';
          messageElement.style.color = 'red';
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        const messageElement = document.getElementById('errorMessage');
        messageElement.textContent = 'Error logging in: ' + error;
        messageElement.style.color = 'red';
      });
  }