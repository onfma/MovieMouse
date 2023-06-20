window.addEventListener("DOMContentLoaded", async function () {
  const search = new URLSearchParams(window.location.search);
  const searchValue = search.get("search");
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58'; 
  const searchEndpoint = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(searchValue)}`;
  const response = await fetch(searchEndpoint);
  const searchData = await response.json();

  if (searchData.results && searchData.results.length > 0) {
    let personData = searchData.results[0];

    personQueryData = searchData.results.reduce((prev, current) => {
      return (current.popularity > prev.popularity) ? current : prev;
    });

    const personId = personQueryData.id;
    const personEndpoint = `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}`;
    const personResponse = await fetch(personEndpoint);
    personData = await personResponse.json();

    const actorName = document.getElementById("actorName");
    actorName.textContent = personData.name;

    const biography = document.getElementById("biographySection");
    biography.textContent = personData.biography;

    if (biography.textContent.length > 500) {
      const truncatedBiography = biography.textContent.substring(0, 500);
      const periodIndex = truncatedBiography.lastIndexOf('.');
      if (periodIndex !== -1) {
        biography.textContent = truncatedBiography.substring(0, periodIndex + 1);
      } else {
        biography.textContent = truncatedBiography;
      }
    }
    
    const birthDay = document.getElementById("birthDay");
    birthDay.textContent = personData.birthday;

    const birthPlace = document.getElementById("birthPlace");
    birthPlace.textContent = personData.place_of_birth;

    const headShot = document.getElementById("headShot");
    const headShotPath = personData.profile_path;
    headShot.src = `https://image.tmdb.org/t/p/w500${headShotPath}`;
    headShot.alt = personData.name;

    const images = document.querySelectorAll('.image_column img');

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const captionTitle = image.nextElementSibling;
      const captionText = captionTitle.nextElementSibling;
    
        if (personQueryData.known_for && personQueryData.known_for.length > i) {
          const knownForItem = personQueryData.known_for[i];
          const posterPath = knownForItem.poster_path;
          const title = knownForItem.title;
          const description = knownForItem.overview;
    
          image.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
          image.alt = title;
    
          if (captionTitle && captionText) {
            captionTitle.textContent = title;
            if (description.length > 70) {
              const truncatedDescription = description.substring(0, 75) + "...";
              captionText.textContent = truncatedDescription;
              const hoverBox = document.createElement("textarea");
              hoverBox.classList.add("hoverBox");
              hoverBox.readOnly = true;
              hoverBox.value = description;
              captionText.appendChild(hoverBox);
            } else {
              captionText.textContent = description;
            }
          }
          
          image.style.display = 'block';
          image.parentElement.style.display = 'block';
        } else {
          image.style.display = 'none';
          image.parentElement.style.display = 'none';
        }
    }
  }
});