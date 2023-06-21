function fetchSAGAwardsNews() {
    const apiKey = 'f3a7f390f0a40390b79dc8cc1536afab';
    const query = 'SAG Awards';
  
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${apiKey}&sortby=popularity`;
  
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        const articles = data.articles.slice(0, 3);
        const videoColumns = document.querySelectorAll('.pageContent_2 .video_column');
  
        articles.forEach((article, index) => {
          const videoColumn = videoColumns[index];
          const videoPlayer = videoColumn.querySelector('.pageContent_2 .video_player');
          const caption = videoColumn.querySelector('.pageContent_2 .video_caption');
  
          videoPlayer.src = article.image;
          videoPlayer.alt = article.title;
  
          caption.textContent = article.title;
          caption.onclick = function () {
            window.location.href = article.url;
          };
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  fetchSAGAwardsNews();
  