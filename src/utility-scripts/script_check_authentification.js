window.addEventListener("DOMContentLoaded", async function () {
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated && !(window.location.pathname.includes('loginpage.html') || window.location.pathname.includes('createaccountpage.html'))) {
        displayNotLoggedInMessage();
    }
    if ((window.location.pathname.includes('loginpage.html') || window.location.pathname.includes('createaccountpage.html')) && isAuthenticated == true) {
        displayLoggedInMessage();
    }
  });
  
async function checkAuthentication() {
    try {
        const response = await fetch('http://localhost:3000/check-authentication', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });

        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}
  
function displayNotLoggedInMessage() {
    const bodyElement = document.querySelector('html');
    bodyElement.innerHTML = '<body style="background-color: black;"><p style="color: green;">>>You are not logged in.</p></body>';
  }
  
function displayLoggedInMessage() {
    const bodyElement = document.querySelector('html');
    bodyElement.innerHTML = '<body style="background-color: black;"><p style="color: green;">>>You are alredy logged in.</p></body>';
  }
  