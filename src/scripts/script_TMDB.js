const API_KEY = '511872553a81d800cdd21ea0126b3049'

fetch('https://api.themoviedb.org/3/configuration?api_key=511872553a81d800cdd21ea0126b3049')
  .then(response => response.json())
  .then(data => {
    // Do something with the response data
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error(error);
  });