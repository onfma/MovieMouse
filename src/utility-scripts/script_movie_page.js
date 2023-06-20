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
    else{
        window.location.href = "../pages/404errorpage.html";
    }
    const movieName = searchValue;
    const apiUrl = `http://localhost:3000/movies/name/${encodeURIComponent(movieName)}`;
    const response1 = await fetch(apiUrl);
    const data = await response1.json();
    if(data.length === 0){
      window.location.href = "../pages/404errorpage.html";
    }
    const nominations = data.nominations;
    const nominationCount = data.nominationCount - data.winCount;
    const winCount = data.winCount;
  
    const tableContainer = document.getElementById("tableContainer");
  
    const table = document.createElement("table");
    table.classList.add("nominationTable");
    const headerRow = document.createElement("tr");
  
    Object.keys(nominations[0]).forEach((field) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = field;
      headerRow.appendChild(headerCell);
    });
  
    table.appendChild(headerRow);
  
    nominations.forEach((nomination) => {
      const dataRow = document.createElement("tr");
      
      if (nomination.won === "True") {
        dataRow.classList.add("won");
      } else {
        dataRow.classList.add("not-won");
      }
      
      Object.values(nomination).forEach((value) => {
        const dataCell = document.createElement("td");
        dataCell.textContent = value;
        dataRow.appendChild(dataCell);
      });
      
      table.appendChild(dataRow);
    });
    tableContainer.appendChild(table);
    
    const pieChartCanvas = document.getElementById("pieChart");
    const pieChart = new Chart(pieChartCanvas, {
      type: "pie",
      data: {
        labels: ["Nominations", "Wins"],
        datasets: [
          {
            data: [nominationCount, winCount],
            borderColor: "#FFF2EE",
            backgroundColor: ["#74BDCB", "#ffa184"],
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        width: 500, 
        height: 500,
        plugins: {
            legend: {
              position: 'left',
            }
        }
    }
    });
  });
  