function fetchSAGAwardsNews() {
    const apiKey = '03528f82030117c5058564b2f4be2f78';
    const query = 'SAG Awards';
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${apiKey}`;
  
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        const articles = data.articles.slice(0, 5); // Get the top 5 articles
  
        const imgMares = document.querySelectorAll('.pageContent_specialSection_dreapta .imgMare');
        const textElements = document.querySelectorAll('.pageContent_specialSection_dreapta .text');
  
        articles.forEach((article, index) => {
          const imgMare = imgMares[index];
          const textElement = textElements[index];
  
          imgMare.innerHTML = `<img src="${article.image}" onclick="window.location.href='${article.url}';">`;
          textElement.innerHTML = `<div class="text" onclick="window.location.href='${article.url}';">${article.title}</div>`;
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  fetchSAGAwardsNews();