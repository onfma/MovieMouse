function getActorNominationStatistics() {
  return fetch('http://localhost:3000/actors/statistics')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    });
}

function getRandomYear(years) {
  const randomIndex = Math.floor(Math.random() * years.length);
  return years[randomIndex];
}

function getActorProfileByName(actorName, apiKey) {
  const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}`;

  return fetch(searchUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then(data => {
      if (data.results && data.results.length > 0) {
        return data.results[0].profile_path;
      } else {
        throw new Error('Actor not found');
      }
    });
}

function displayWinners() {
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58';

  getActorNominationStatistics()
    .then(nominationStatistics => {
      const years = Object.keys(nominationStatistics);
      const randomYear = getRandomYear(years);
      const categories = Object.keys(nominationStatistics[randomYear]).slice(0, 4);

      const imageColumns = document.querySelectorAll('.pageContent_1 .image_column');

      categories.forEach(async (category, index) => {
        const nominees = nominationStatistics[randomYear][category].nominees;
        const randomIndex = Math.floor(Math.random() * nominees.length);
        const nominee = nominees[randomIndex];
        const show = nominee.show;
        const imageColumn = imageColumns[index];

        const captionDate = imageColumn.querySelector('.image_caption_date');
        const captionTitle = imageColumn.querySelector('.image_caption_title');
        const captionText = imageColumn.querySelector('.image_caption_text');
        const img = imageColumn.querySelector('img');
        const linkElement = imageColumn.querySelector('.link');

        captionDate.textContent = randomYear;
        captionTitle.textContent = nominee.name;
        captionText.textContent = `Nominee for ${category} for an outstanding performance in ${show}`;
        linkElement.href = `./templateActorpage.html?search=${encodeURIComponent(nominee.name)}`;

        try {
          const actorProfile = await getActorProfileByName(nominee.name, apiKey);
          img.src = `https://image.tmdb.org/t/p/w500${actorProfile}`;
          img.alt = nominee.name;
        } catch (error) {
          console.error('Error:', error);
        }

        // Handle link click event
        linkElement.addEventListener('click', event => {
          event.preventDefault(); // Prevent the default link behavior
          const url = linkElement.href;
          window.location.href = url;
        });
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

displayWinners();

