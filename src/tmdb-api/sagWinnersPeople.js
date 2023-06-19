const apiKey = '9d086ab036170e8ab7e68ab954be6f58';

const sagIds = [1620, 18269, 8944, 690, 38334, 23532, 5376, 206905, 83002, 16431];

// Choose 4 random IDs from sagIds
const randomIds = [];
while (randomIds.length < 4) {
  const randomId = sagIds[Math.floor(Math.random() * sagIds.length)];
  if (!randomIds.includes(randomId)) {
    randomIds.push(randomId);
  }
}

const personUrls = randomIds.map(id => `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`);

Promise.all(personUrls.map(url => fetch(url)))
  .then(responses => {
    return Promise.all(responses.map(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    }));
  })
  .then(personData => {
    const imageColumns = document.querySelectorAll('.pageContent_1 .image_column');

    for (let i = 0; i < personData.length; i++) {
      const person = personData[i];
      const imageColumn = imageColumns[i];

      const img = imageColumn.querySelector('img');
      img.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
      img.alt = person.name;

      const captionDate = imageColumn.querySelector('.image_caption_date');
      captionDate.textContent = 'The 29th Annual SAG Awards';

      const captionTitle = imageColumn.querySelector('.image_caption_title');
      captionTitle.textContent = person.name;

      const captionText = imageColumn.querySelector('.image_caption_text');
      if(person.id == 16431) captionText.textContent='MALE ACTOR IN A TELEVISION MOVIE OR LIMITED SERIES';
      else if(person.id == 83002) captionText.textContent='FEMALE ACTOR IN A TELEVISION MOVIE OR LIMITED SERIES ';
      else if(person.id == 206905) captionText.textContent='MALE ACTOR IN A COMEDY SERIES';
      else if(person.id == 5376) captionText.textContent='FEMALE ACTOR IN A COMEDY SERIES';
      else if(person.id == 23532) captionText.textContent='MALE ACTOR IN A DRAMA SERIES';
      else if(person.id == 38334) captionText.textContent='FEMALE ACTOR IN A DRAMA SERIES';
      else if(person.id == 690) captionText.textContent='MALE ACTOR IN A SUPPORTING ROLE';
      else if(person.id == 8944) captionText.textContent='FEMALE ACTOR IN A SUPPORTING ROLE';
      else if(person.id == 18269) captionText.textContent='MALE ACTOR IN A LEADING ROLE';
      else if(person.id == 1620) captionText.textContent='FEMALE ACTOR IN A LEADING ROLE';
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
