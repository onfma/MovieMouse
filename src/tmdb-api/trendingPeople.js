function trendingPeople(){
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58';

  const trendingUrl = `https://api.themoviedb.org/3/trending/person/day?api_key=${apiKey}`;
  
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
  
      const imageColumns = document.querySelectorAll('.pageContent_4 .pageSection .pageContent_imgSection .image_row .image_column');
  
      for (let i = 0; i < trendingPeople.length; i++) {
        const person = trendingPeople[i];
        const imageColumn = imageColumns[i];

        const linkElement = imageColumn.querySelector('.link');
        linkElement.href = `./templateActorpage.html?search=${encodeURIComponent(person.name)}`;
  
        const img = imageColumn.querySelector('img');
        img.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        img.alt = person.name;
  
        const captionDate = imageColumn.querySelector('.image_caption_date');
        captionDate.textContent = person.known_for_department;
  
        const captionTitle = imageColumn.querySelector('.image_caption_title');
        captionTitle.textContent = person.name;
  
        const captionText = imageColumn.querySelector('.image_caption_text');
        const knownFor = person.known_for.map(item => item.title).join(', ');
  
        // Description up to 150 characters
        if (knownFor.length > 150) {
          const truncated = knownFor.substring(0, 150) + "...";
          captionText.textContent = truncated;
          const hoverBox = document.createElement("div");
          hoverBox.classList.add("hoverBox");
          hoverBox.textContent = knownFor;
          captionText.appendChild(hoverBox);
        } else {
          captionText.textContent = knownFor;
        }

        linkElement.addEventListener('click', event => {
          event.preventDefault(); // Prevent the default link behavior
          const url = linkElement.href;

          testLinkValidity(url)
            .then(valid => {
              if (valid) {
                window.location.href = url;
              } else {
                window.location.href = `https://www.themoviedb.org/person/${person.id}`;
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

trendingPeople();
