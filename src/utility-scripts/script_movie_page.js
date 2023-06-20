window.addEventListener("DOMContentLoaded", async function () {
    const search = new URLSearchParams(window.location.search);
    const searchValue = search.get("search");
    const apiKey = '9d086ab036170e8ab7e68ab954be6f58'; 
  
    const movieSearchEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchValue)}`;
    const movieSearchResponse = await fetch(movieSearchEndpoint);
    const movieSearchData = await movieSearchResponse.json();
  

    if (movieSearchData.results && movieSearchData.results.length > 0) {
        const movieQueryData = movieSearchData.results[0];

        const movieDataEndpoint = `https://api.themoviedb.org/3/movie/${movieQueryData.id}?api_key=${apiKey}`;
        const movieDataResponse = await fetch(movieDataEndpoint);
        const movieData = await movieDataResponse.json();

        const movieName = document.getElementById("movieName");
        movieName.textContent = movieData.title;
    
        const year = document.getElementById("year");
        year.textContent = movieData.release_date.substring(0, 4);
    
        const duration = document.getElementById("duration");
        duration.textContent = `${movieData.runtime} min`;
    
        const genres = movieData.genres.map((genre) => genre.name).join(", ");
        const genreText = document.getElementById("genres");
        genreText.textContent = genres;
    
        const description = document.getElementById("description");
        description.textContent = movieData.overview;

        const poster = document.getElementById("poster");
        const posterPath = movieData.poster_path;
        poster.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
        poster.alt = movieData.name;
    
        const creditsEndpoint = `https://api.themoviedb.org/3/movie/${movieData.id}/credits?api_key=${apiKey}`;
        const creditsResponse = await fetch(creditsEndpoint);
        const creditsData = await creditsResponse.json();

        const directorData = creditsData.crew
        .filter((crewMember) => crewMember.job === "Director")
        .map((director) => director.name)
        .join(", ");
        const director = document.getElementById("director");
        director.textContent = directorData;
    
    
        const popularCast = creditsData.cast.slice(0, 4);
    
        const images = document.querySelectorAll('.image_column img');
    
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const captionTitle = image.nextElementSibling;
        const captionText = captionTitle.nextElementSibling;

        if (popularCast.length > i) {
            const person = popularCast[i];
            const profilePath = person.profile_path;
            const name = person.name;
            let knownForDepartment = person.known_for_department;
            if (knownForDepartment === "Acting") {
                knownForDepartment = knownForDepartment + " as " + person.character;
            }

            image.src = `https://image.tmdb.org/t/p/w500${profilePath}`;
            image.alt = name;

            captionTitle.textContent = name;
            captionText.textContent = knownForDepartment;

            image.style.display = 'block';
            image.parentElement.style.display = 'block';
            } else {
            image.style.display = 'none';
            image.parentElement.style.display = 'none';
        }
    }
    }
  });
  