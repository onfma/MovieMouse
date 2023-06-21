function fetchSAGAwardsNews() {
    const apiKey = '03528f82030117c5058564b2f4be2f78';
    const query = 'SAG Awards';
    
    // Calculate the date range for the last week
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fromDate = oneWeekAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&from=${fromDate}&to=${toDate}&token=${apiKey}&sortby=popularity`;
  
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        const articles = data.articles;
        const secondArticle = articles[1]; // The second article (index 1)
  
        if (secondArticle) {
          const imgMare = document.querySelector('.pageContent_specialSection_stanga .imgMare');
          const textElement = document.querySelector('.pageContent_specialSection_stanga .textBox .text');
  
          imgMare.innerHTML = `<img src="${secondArticle.image}" onclick="window.location.href='${secondArticle.url}';">`;
          textElement.innerHTML = `<div class="text" onclick="window.location.href='${secondArticle.url}';">${secondArticle.title}</div>`;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  fetchSAGAwardsNews();
  