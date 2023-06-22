window.addEventListener("DOMContentLoaded", async function () {
    const data = await checkAuthentication();
    const isAuthenticated = data.authenticated;
    const username = data.userName;
    //if(username != 'admin' && (window.location.pathname.includes('adminpage.html'))){
     //   displayAdminfailMessage();
    //}
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
        return data;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}
  
function displayNotLoggedInMessage() {
    const bodyElement = document.querySelector('html');
    bodyElement.innerHTML = `
      <body style="background-color: black;">
        <p style="color: green;">>>You are not logged in.</p>
        <p style="color: green;">Please <a href="./loginpage.html">login</a> to continue.</p>
      </body>`;
  }
  
function displayLoggedInMessage() {
    const bodyElement = document.querySelector('html');
    bodyElement.innerHTML = `
      <body style="background-color: black;">
        <p style="color: green;">>>You are alredy logged in.</p>
        <p style="color: green;">Redirect to <a href="./homepage.html">homepage</a>.</p>
      </body>`;
  }
  
function displayAdminfailMessage() {
    const bodyElement = document.querySelector('html');
    bodyElement.innerHTML = `
      <body style="background-color: black;">
        <p style="color: green;">>>You are not logged in as admin.</p>
        <p style="color: green;">Redirect to <a href="./homepage.html">homepage</a>.</p>
      </body>`;
  }
  