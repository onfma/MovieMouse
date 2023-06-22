const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/screen_actor_guild_awards.csv');
      const csvData = await response.text();
  
      const rows = csvData.split('\n');
      const header = rows[0].split(',');
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        const obj = {};
        for (let i = 0; i < header.length; i++) {
          obj[header[i]] = values[i];
        }
        return obj;
      });
      var filteredData;
  
      const itemsPerPage = 10;
      let currentPage = 1;
      let totalPages = Math.ceil(data.length / itemsPerPage);
      let filteredTotalPages = totalPages; 
  
      const renderTable = (page) => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
  
        const categoryFilterValue = document.getElementById('categoryFilter').value;
        const fullNameFilterValue = document.getElementById('fullNameFilter').value;
        const yearFilterValue = document.getElementById('yearFilter').value;
        const showFilterValue = document.getElementById('showFilter').value;
        let filteredData = data;
        if (categoryFilterValue || fullNameFilterValue || yearFilterValue || showFilterValue) {
          filteredData = data.filter(rowData => {
  
            
          const categoryMatches = (categoryFilterValue === '') || (rowData.category && (rowData.category.toLowerCase().includes(categoryFilterValue.toLowerCase()) || rowData.category.toLowerCase() === categoryFilterValue.toLowerCase()));
          const fullNameMatches = (fullNameFilterValue === '') || rowData.full_name && (rowData.full_name.toLowerCase().includes(fullNameFilterValue.toLowerCase()) || rowData.full_name.toLowerCase() === fullNameFilterValue.toLowerCase());
          const yearMatches = (yearFilterValue === '') || rowData.year && (rowData.year.toLowerCase().includes(yearFilterValue.toLowerCase()) || rowData.year.toLowerCase() === yearFilterValue.toLowerCase());
          const showMatches = (showFilterValue === '') || rowData.show && (rowData.show.toLowerCase().includes(showFilterValue.toLowerCase()) || rowData.show.toLowerCase() === showFilterValue.toLowerCase());
            return categoryMatches && fullNameMatches && yearMatches && showMatches;
          });
          totalPages = Math.ceil(filteredData.length / itemsPerPage);
          updatePageCounter();
        }
  
  
        const pageData = filteredData.slice(start, end);
  
        const tableNavigationContainer = document.getElementById('tableNavigationContainer');
        tableNavigationContainer.innerHTML = '';
  
        const table = document.createElement('table');
        table.classList.add('table');
  
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        header.forEach(column => {
          const th = document.createElement('th');
          th.textContent = column;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
  
        const tbody = document.createElement('tbody');
        pageData.forEach(rowData => {
          const row = document.createElement('tr');
          header.forEach(column => {
            const td = document.createElement('td');
            td.textContent = rowData[column] || '';
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
  
        tableNavigationContainer.appendChild(table);
        renderPagination();
      };
  
      const renderPagination = () => {
        const paginationContainer = document.querySelector('.pagination');
        const categoryFilterInput = document.getElementById('categoryFilter');
        const fullNameFilterInput = document.getElementById('fullNameFilter');
        const yearFilterInput = document.getElementById('yearFilter');
        const showFilterInput = document.getElementById('showFilter');
  
        paginationContainer.innerHTML = '';
  
        const prevButton = document.createElement('button');
        prevButton.id = 'prevPageBtn';
        prevButton.textContent = '<';
  
        const currentPageSpan = document.createElement('span');
        currentPageSpan.id = 'currentPage';
  
        const nextButton = document.createElement('button');
        nextButton.id = 'nextPageBtn';
        nextButton.textContent = '>';

        const downloadButton = document.createElement('button');
        downloadButton.id = 'downloadCSV';
        downloadButton.textContent = 'Download CSV';

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(currentPageSpan);
        paginationContainer.appendChild(nextButton);
        paginationContainer.appendChild(downloadButton);
        const newPrevPageBtn = document.getElementById('prevPageBtn');
        const newNextPageBtn = document.getElementById('nextPageBtn');
        const downloadBtn = document.getElementById("downloadCSV");
  
        newPrevPageBtn.disabled = currentPage === 1;
        newNextPageBtn.disabled = currentPage === totalPages;
  
        newPrevPageBtn.addEventListener('click', () => {
          currentPage--;
          renderTable(currentPage);
          newPrevPageBtn.disabled = currentPage === 1;
          newNextPageBtn.disabled = false;
          updatePageCounter();
        });
  
        newNextPageBtn.addEventListener('click', () => {
          currentPage++;
          renderTable(currentPage);
          newPrevPageBtn.disabled = false;
          newNextPageBtn.disabled = currentPage === totalPages;
          updatePageCounter();
        });

        downloadBtn.addEventListener('click', () => {
          const categoryFilterValue = document.getElementById('categoryFilter').value;
          const fullNameFilterValue = document.getElementById('fullNameFilter').value;
          const yearFilterValue = document.getElementById('yearFilter').value;
          const showFilterValue = document.getElementById('showFilter').value;
        
          const filteredData = data.filter(rowData => {
            const categoryMatches = (categoryFilterValue === '') || (rowData.category && (rowData.category.toLowerCase().includes(categoryFilterValue.toLowerCase()) || rowData.category.toLowerCase() === categoryFilterValue.toLowerCase()));
            const fullNameMatches = (fullNameFilterValue === '') || rowData.full_name && (rowData.full_name.toLowerCase().includes(fullNameFilterValue.toLowerCase()) || rowData.full_name.toLowerCase() === fullNameFilterValue.toLowerCase());
            const yearMatches = (yearFilterValue === '') || rowData.year && (rowData.year.toLowerCase().includes(yearFilterValue.toLowerCase()) || rowData.year.toLowerCase() === yearFilterValue.toLowerCase());
            const showMatches = (showFilterValue === '') || rowData.show && (rowData.show.toLowerCase().includes(showFilterValue.toLowerCase()) || rowData.show.toLowerCase() === showFilterValue.toLowerCase());
        
            return categoryMatches && fullNameMatches && yearMatches && showMatches;
          });
          const csvContent = convertToCSV(filteredData);
          downloadCSV("SAG-data.csv", csvContent);
        });
  
        updatePageCounter();
      };
  
      const updatePageCounter = () => {
        const currentPageSpan = document.getElementById('currentPage');
        currentPageSpan.textContent = `${currentPage}/${totalPages}`;
      };
  
      const applyFilter = () => {
        currentPage = 1;
        const categoryFilterValue = document.getElementById('categoryFilter').value;
        const fullNameFilterValue = document.getElementById('fullNameFilter').value;
        const yearFilterValue = document.getElementById('yearFilter').value;
        const showFilterValue = document.getElementById('showFilter').value;
  
  
        const filteredData = data.filter(rowData => {
          const categoryMatches = (categoryFilterValue === '') || (rowData.category && (rowData.category.toLowerCase().includes(categoryFilterValue.toLowerCase()) || rowData.category.toLowerCase() === categoryFilterValue.toLowerCase()));
          const fullNameMatches = (fullNameFilterValue === '') || rowData.full_name && (rowData.full_name.toLowerCase().includes(fullNameFilterValue.toLowerCase()) || rowData.full_name.toLowerCase() === fullNameFilterValue.toLowerCase());
          const yearMatches = (yearFilterValue === '') || rowData.year && (rowData.year.toLowerCase().includes(yearFilterValue.toLowerCase()) || rowData.year.toLowerCase() === yearFilterValue.toLowerCase());
          const showMatches = (showFilterValue === '') || rowData.show && (rowData.show.toLowerCase().includes(showFilterValue.toLowerCase()) || rowData.show.toLowerCase() === showFilterValue.toLowerCase());
  
          return categoryMatches && fullNameMatches && yearMatches && showMatches;
        });
  
        filteredTotalPages = Math.ceil(filteredData.length / itemsPerPage);
        totalPages = filteredTotalPages;
        renderTable(currentPage);
        renderPagination();
        updatePageCounter();
      };
  
      const initAutocomplete = (input, dropdown, dataKey) => {
        let currentFocus;
      
        const closeAllLists = () => {
          dropdown.innerHTML = '';
          dropdown.style.display = 'none';
        };
      
        const addActiveClass = (index) => {
          const items = dropdown.getElementsByClassName('autocomplete-item');
          for (let i = 0; i < items.length; i++) {
            if (i === index) {
              items[i].classList.add('autocomplete-active');
            } else {
              items[i].classList.remove('autocomplete-active');
            }
          }
        };
      
        const removeActiveClass = () => {
          const items = dropdown.getElementsByClassName('autocomplete-item');
          for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('autocomplete-active');
          }
        };
      
        const simulateClick = () => {
          const activeItem = dropdown.querySelector('.autocomplete-item.autocomplete-active');
          if (activeItem) {
            activeItem.click();
          }
        };
      
        const onInputKeyDown = (event) => {
          const items = dropdown.getElementsByClassName('autocomplete-item');
          if (event.keyCode === 40) {
            // Arrow down
            currentFocus++;
            addActiveClass(currentFocus);
          } else if (event.keyCode === 38) {
            // Arrow up
            currentFocus--;
            addActiveClass(currentFocus);
          } else if (event.keyCode === 13) {
            // Enter
            event.preventDefault();
            simulateClick();
          } else if (event.keyCode === 27) {
            // Escape
            removeActiveClass();
            closeAllLists();
          }
        };
      
        const onInputKeyUp = (event) => {
          if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 13 || event.keyCode === 27) {
            return;
          }
      
          const inputValue = input.value.toLowerCase();
          closeAllLists();
      
          if (!inputValue) {
            return;
          }
      
          currentFocus = -1;
          const filteredData = data
          .filter((rowData, index, self) => {
            return (
              rowData[dataKey] &&
              rowData[dataKey].toLowerCase().includes(inputValue.toLowerCase()) &&
              self.findIndex((r) => r[dataKey] === rowData[dataKey]) === index
            );
          });
      
          const dropdownContainer = document.createElement('div');
          dropdownContainer.classList.add('autocomplete-items');
      
          filteredData.forEach((rowData, index) => {
            const item = document.createElement('div');
  
            const regex = new RegExp(inputValue, "gi");
            item.innerHTML = rowData[dataKey].replace(regex, (match) => `<strong>${match}</strong>`);
            item.classList.add('autocomplete-item');
      
            item.addEventListener('click', () => {
              input.value = rowData[dataKey];
              closeAllLists();
              applyFilter(input.value);
            });
      
            dropdownContainer.appendChild(item);
          });
      
          dropdown.appendChild(dropdownContainer);
          dropdown.style.display = 'block';
      
          dropdownContainer.style.maxHeight = '200px';
          dropdownContainer.style.overflowY = 'auto';
        };
      
        input.addEventListener('keydown', onInputKeyDown);
        input.addEventListener('keyup', onInputKeyUp);
      
        document.addEventListener('click', (event) => {
          if (event.target !== input) {
            closeAllLists();
          }
        });

      };
      const categoryInput = document.getElementById('categoryFilter');
      const fullNameInput = document.getElementById('fullNameFilter');
      const yearInput = document.getElementById('yearFilter');
      const showInput = document.getElementById('showFilter');
  
      const categoryDropdown = document.getElementById('categoryDropdown');
      const fullNameDropdown = document.getElementById('fullNameDropdown');
      const yearDropdown = document.getElementById('yearDropdown');
      const showDropdown = document.getElementById('showDropdown');
  
      initAutocomplete(categoryInput, categoryDropdown, 'category');
      initAutocomplete(fullNameInput, fullNameDropdown, 'full_name');
      initAutocomplete(yearInput, yearDropdown, 'year');
      initAutocomplete(showInput, showDropdown, 'show');
  
      renderTable(currentPage);
  
      const applyFilterBtn = document.getElementById('applyFilterBtn');
      applyFilterBtn.addEventListener('click', () => {
        applyFilter(categoryInput.value);
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchData();

const convertToCSV = (data) => {
  const header = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  return header + "\n" + rows.join("\n");
};

const downloadCSV = (filename, csvContent) => {
  const element = document.createElement("a");
  const encodedURI = encodeURI(csvContent);
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodedURI);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

window.addEventListener("DOMContentLoaded", async function () {

  let apiUrl = `http://localhost:3000/movies`;
  let response = await fetch(apiUrl);
  let movieData = await response.json();

  movieData = movieData.sort((a, b) => b.nominationCount - a.nominationCount).slice(0, 7).sort((a, b) => b.winCount - a.winCount).sort((a, b) => b.nominationCount - a.nominationCount);
  movieNames = movieData.map((item) => {
    return  item.name ;
  });
  movieNominations = movieData.map((item) => {
    return item.nominationCount;
  });
  movieWins = movieData.map((item) => {
    return item.winCount;
  });


  let data = {
    labels: movieNames,
    datasets: [{
      data: movieNominations,
      backgroundColor: [
        'rgba(38, 70, 83, 0.5)',
        'rgba(42, 157, 143, 0.5)',
        'rgba(233, 196, 106, 0.5)',
        'rgba(244, 162, 97, 0.5)',
        'rgba(231, 111, 81, 0.5)',
        'rgba(236, 140, 116, 0.5)',
        'rgba(240, 163, 144, 0.5)'
      ],
      borderColor: [
        'rgba(38, 70, 83)',
        'rgba(42, 157, 143)',
        'rgba(233, 196, 106)',
        'rgba(244, 162, 97)',
        'rgba(231, 111, 81)',
        'rgba(236, 140, 116)',
        'rgba(240, 163, 144)'
      ],
      borderWidth: 1
    }]
  };

  var chrt = document.getElementById("MovieBarChart").getContext("2d");
  var chartId = new Chart(chrt, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            max: 20
          }
        },
        x: {
          grid: {
            display: false 
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              var index = context.dataIndex;
              return "Wins" + ': ' + movieWins[index] + " out of " + movieNominations[index];
            }
          }
        },
        legend: {
          display: false 
        }
      }
    },
  
  });

  apiUrl = `http://localhost:3000/series`;
  response = await fetch(apiUrl);
  let seriesData = await response.json();

  seriesData = seriesData.sort((a, b) => b.nominationCount - a.nominationCount).slice(0, 7).sort((a, b) => b.winCount - a.winCount).sort((a, b) => b.nominationCount - a.nominationCount);
  seriesNames = seriesData.map((item) => {
    return item.name;
  });
  seriesNominations = seriesData.map((item) => {
    return item.nominationCount;
  });
  seriesWins = seriesData.map((item) => {
    return item.winCount;
  });



  data = {
    labels: seriesNames,
    datasets: [{
      data: seriesNominations,
      backgroundColor: [
        'rgba(136, 53, 43, 0.5)',
        'rgba(208, 117, 92, 0.5)',
        'rgba(235, 206, 177, 0.5)',
        'rgba(238, 233, 222, 0.5)',
        'rgba(146, 148, 137, 0.5)',
        'rgba(121, 129, 135, 0.5)',
        'rgba(87, 97, 105, 0.5)'
      ],
      borderColor: [
        'rgba(136, 53, 43)',
        'rgba(208, 117, 92)',
        'rgba(235, 206, 177)',
        'rgba(238, 233, 222)',
        'rgba(146, 148, 137, 0.7)',
        'rgba(121, 129, 135)',
        'rgba(87, 97, 105, 0.7)'
      ],
      borderWidth: 1
    }]
  };

  var chrt = document.getElementById("SeriesBarChart").getContext("2d");
  var chartId = new Chart(chrt, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5 
          }
        },
        x: {
          grid: {
            display: false 
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              var index = context.dataIndex;
              return "Wins" + ': ' + seriesWins[index] + " out of " + seriesNominations[index];
            }
          }
        },
        legend: {
          display: false
        }
      }
    },
  
  });
});