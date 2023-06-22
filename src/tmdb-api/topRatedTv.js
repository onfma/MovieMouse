function topRatedTV() {
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58';

  const trendingUrl = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
  
  fetch(trendingUrl)
    .then(response => response.json())
    .then(data => {
      const trendingMovies = data.results.slice(0, 4);
  
      const imageColumns = document.querySelectorAll('.pageContent_4 .image_column');
  
      for (let i = 0; i < trendingMovies.length; i++) {
        const movie = trendingMovies[i];
        const imageColumn = imageColumns[i];
  
        const img = imageColumn.querySelector('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
  
        const captionDate = imageColumn.querySelector('.image_caption_date');
        captionDate.textContent = movie.first_air_date;
  
        const captionTitle = imageColumn.querySelector('.image_caption_title');
        captionTitle.textContent = movie.name;

        const linkElement = imageColumn.querySelector('.link');
        linkElement.href = `./src/pages/templateTVShowpage.html?search=${encodeURIComponent(movie.name)}`;
        let tmdbRedirectURL = `https://www.themoviedb.org/tv/${movie.id}`;
  
        const captionText = imageColumn.querySelector('.image_caption_text');
        const overview = movie.overview;
  
        // descrierea pana in 150 de caractere
        if (overview.length > 150) {
          const truncated = overview.substring(0, 150) + "...";
          captionText.textContent = truncated;
          const hoverBox = document.createElement("div");
          hoverBox.classList.add("hoverBox");
          hoverBox.textContent = overview;
          captionText.appendChild(hoverBox);
        } else {
          captionText.textContent = overview;
        }

        // Handle link click event
        linkElement.addEventListener('click', event => {
          event.preventDefault(); // Prevent the default link behavior
          const url = linkElement.href;

          testLinkValidity(url)
            .then(valid => {
              if (valid) {
                window.location.href = url;
              } else {
                window.location.href = tmdbRedirectURL;
              }
            });
        });

      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function testLinkValidity(url) {
  return fetch(url, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        // Link is valid
        return true;
      } else {
        // Link is not valid
        return false;
      }
    })
    .catch(error => {
      // An error occurred, link is not valid
      console.error('Error:', error);
      return false;
    });
}

topRatedTV();
