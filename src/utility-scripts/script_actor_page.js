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
              const hoverBox = document.createElement("div");
              hoverBox.classList.add("hoverBox");
              hoverBox.textContent = description;
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
  else{
      window.location.href = "../pages/404errorpage.html";
  }
  const actorName = searchValue;
  const apiUrl = `http://localhost:3000/actors/name/${encodeURIComponent(actorName)}`;
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