function trendingTVShows() {
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58';
  const trendingUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;
  
  fetch(trendingUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then(data => {
      const trendingTVShows = data.results.slice(0, 3);
  
      const videoColumns = document.querySelectorAll('.video_column');
  
      for (let i = 0; i < trendingTVShows.length; i++) {
        const show = trendingTVShows[i];
        const videoColumn = videoColumns[i];
  
        // Fetch the trailer videos for the current TV show
        const videosUrl = `https://api.themoviedb.org/3/tv/${show.id}/videos?api_key=${apiKey}`;
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
        captionTitle.textContent = show.name;

        let tmdbRedirectURL;
        captionTitle.href = `./src/pages/templateTVshowpage.html?search=${encodeURIComponent(show.name)}`;
        tmdbRedirectURL = `https://www.themoviedb.org/tv/${show.id}`;

        // Handle link click event
        captionTitle.addEventListener('click', event => {
          event.preventDefault(); // Prevent the default link behavior
          const url = captionTitle.href;

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

trendingTVShows();