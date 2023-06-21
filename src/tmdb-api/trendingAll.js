function trendingAll() {
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58'; 

  const trendingUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;

  fetch(trendingUrl)
    .then(response => response.json())
    .then(data => {
      const trendingMovies = data.results.slice(0, 4);

      const imageColumns = document.querySelectorAll('.image_row .image_column');

      for (let i = 0; i < trendingMovies.length; i++) {
        const movie = trendingMovies[i];
        const imageColumn = imageColumns[i];

        const img = imageColumn.querySelector('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;

        const captionDate = imageColumn.querySelector('.image_caption_date');
        if(movie.release_date != null) captionDate.textContent = movie.release_date;
        else captionDate.textContent += movie.first_air_date;

        const captionTitle = imageColumn.querySelector('.image_caption_title');
        if(movie.name != null) captionTitle.textContent = movie.name;
        else captionTitle.textContent = movie.title;
        

        const captionText = imageColumn.querySelector('.image_caption_text');
        const overview = movie.overview;

        // descrierea pana in 150 de caractere
        if (overview.length > 150) {
          captionText.textContent = overview.substring(0, 150) + '...';
        } else {
          captionText.textContent = overview;
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

trendingAll();