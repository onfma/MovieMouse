function upcomingMovies() {
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58';
  const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;

  fetch(upcomingUrl)
    .then(response => { 
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then(data => {
      const upcomingMovies = data.results.slice(1, 4);

      const videoColumns = document.querySelectorAll('.pageContent_3 .video_column');

      for (let i = 0; i < upcomingMovies.length; i++) {
        const movie = upcomingMovies[i];
        const videoColumn = videoColumns[i];

        // Fetch the trailer videos for the current movie
        const videosUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`;
        fetch(videosUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not OK');
            }
            return response.json();
          })
          .then(videoData => {
            // Check if there are any videos available
            if (videoData.results.length > 0) {
              const trailerKey = videoData.results[0].key;
              const videoPlayer = videoColumn.querySelector('.video_player');
              videoPlayer.src = `https://www.youtube.com/embed/${trailerKey}`;
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });

        const captionTitle = videoColumn.querySelector('.video_caption');
        captionTitle.textContent = movie.title;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

upcomingMovies();