const apiKey = '9d086ab036170e8ab7e68ab954be6f58';

const trendingUrl = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`;

fetch(trendingUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);

    const trendingPeople = data.results.slice(0, 4);
    console.log(trendingPeople);

    const imageColumns = document.querySelectorAll('.formular_vote .image_row .image_column');

    for (let i = 0; i < trendingPeople.length; i++) {
      const person = trendingPeople[i];
      const imageColumn = imageColumns[i];

      const img = imageColumn.querySelector('img');
      img.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
      img.alt = person.name;

      const captionDate = imageColumn.querySelector('.image_caption_date');
      captionDate.textContent = person.known_for_department;

      const captionTitle = imageColumn.querySelector('.image_caption_title');
      captionTitle.textContent = person.name;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

