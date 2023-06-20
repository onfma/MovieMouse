window.addEventListener("DOMContentLoaded", async function () {
    const search = new URLSearchParams(window.location.search);
    const searchValue = search.get("search");
    const apiKey = '9d086ab036170e8ab7e68ab954be6f58'; 
  
    const showSearchEndpoint = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(searchValue)}`;
    const showSearchResponse = await fetch(showSearchEndpoint);
    const showSearchData = await showSearchResponse.json();
  

    if (showSearchData.results && showSearchData.results.length > 0) {
        const showQueryData = showSearchData.results[0];

        const showDataEndpoint = `https://api.themoviedb.org/3/tv/${showQueryData.id}?api_key=${apiKey}`;
        const showDataResponse = await fetch(showDataEndpoint);
        const showData = await showDataResponse.json();

        const showName = document.getElementById("showName");
        showName.textContent = showData.name;
    
        const creators = showData.created_by.map((a) => a.name).join(", ");
        console.log(creators);
        const creator = document.getElementById("creator");
        creator.textContent = creators;
    
        const year = document.getElementById("year");
        year.textContent = showData.first_air_date.substring(0, 4) + ' - ' + showData.last_air_date.substring(0, 4);
    
        const nrSeason = document.getElementById("nrSeason");
        nrSeason.textContent = showData.number_of_seasons;
    
        const genres = showData.genres.map((genre) => genre.name).join(", ");
        const genreText = document.getElementById("genres");
        genreText.textContent = genres;
    
        const description = document.getElementById("description");
        description.textContent = showData.overview;

        const poster = document.getElementById("poster");
        const posterPath = showData.poster_path;
        poster.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
        poster.alt = showData.name;
    
        const creditsEndpoint = `https://api.themoviedb.org/3/tv/${showData.id}/credits?api_key=${apiKey}`;
        const creditsResponse = await fetch(creditsEndpoint);
        const creditsData = await creditsResponse.json();
    
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
    const showName = searchValue;
    const apiUrl = `http://localhost:3000/series/name/${encodeURIComponent(showName)}`;
    const response1 = await fetch(apiUrl);
    const data = await response1.json();
    if(data.length === 0){
      window.location.href = "../pages/404errorpage.html";
    }
    const nominations = data[0].nominations;
    const nominationCount = data[0].nominationCount - data[0].winCount;
    const winCount = data[0].winCount;
  
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
