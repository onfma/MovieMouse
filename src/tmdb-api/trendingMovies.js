function trendingMovies(){
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58';

  const trendingUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
  
  fetch(trendingUrl)
    .then(response => response.json())
    .then(data => {
      const trendingMovies = data.results.slice(4, 12);
  
      const imageColumns = document.querySelectorAll('.pageContent_4 .image_column');
  
      for (let i = 0; i < trendingMovies.length; i++) {
        const movie = trendingMovies[i];
        const imageColumn = imageColumns[i];
  
        const img = imageColumn.querySelector('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
  
        const captionDate = imageColumn.querySelector('.image_caption_date');
        captionDate.textContent = movie.release_date;
  
        const captionTitle = imageColumn.querySelector('.image_caption_title');
        captionTitle.textContent = movie.title;
  
        const captionText = imageColumn.querySelector('.image_caption_text');
        const overview = movie.overview;
  
        // description up to 150 characters
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
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

trendingMovies();