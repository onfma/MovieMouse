function fetchSAGAwardsNews() {
    const apiKey = '03528f82030117c5058564b2f4be2f78';
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
        const articles = data.articles.slice(3, 6);
        const videoColumns = document.querySelectorAll('.video_column');
  
        articles.forEach((article, index) => {
          const videoColumn = videoColumns[index];
          const videoPlayer = videoColumn.querySelector('.video_player');
          const caption = videoColumn.querySelector('.video_caption');
  
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
  