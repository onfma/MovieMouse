const fetchData = async () => {
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
    try {

  
      const initAutocomplete = (input, dropdown, dataKey) => {
        let currentFocus;
  
        const closeAllLists = () => {
          dropdown.innerHTML = '';
          dropdown.style.display = 'none';
        };
  
        const addActiveClass = (index) => {
          const items = dropdown.getElementsByClassName('autocompleteSearch-item');
          for (let i = 0; i < items.length; i++) {
            if (i === index) {
              items[i].classList.add('autocompleteSearch-active');
            } else {
              items[i].classList.remove('autocompleteSearch-active');
            }
          }
        };
  
        const removeActiveClass = () => {
          const items = dropdown.getElementsByClassName('autocompleteSearch-item');
          for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('autocompleteSearch-active');
          }
        };
  
        const simulateClick = () => {
          const activeItem = dropdown.querySelector('.autocompleteSearch-item.autocompleteSearch-active');
          if (activeItem) {
            activeItem.click();
          }
        };
  
        const onInputKeyDown = (event) => {
          const items = dropdown.getElementsByClassName('autocompleteSearch-item');
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
  
          let filteredData = data;
          currentFocus = -1;
          switch (dataKey) {
            case 'actor':
              filteredData = data.filter((rowData, index, self) => {
                const categoryMatches = rowData.category && (rowData.category.toLowerCase().includes('actor') || rowData.category.toLowerCase().includes('female') || rowData.category.toLowerCase().includes('male'));
                const fullNameMatches = rowData.full_name && rowData.full_name.toLowerCase().includes(inputValue);
                return categoryMatches && fullNameMatches && self.findIndex((r) => r.full_name === rowData.full_name) === index;
              });
              break;
            case 'movie':
              filteredData = data.filter((rowData, index, self) => {
                const categoryMatches = rowData.category && rowData.category.toLowerCase().includes('motion picture') && (!rowData.category.toLowerCase().includes('female') && !rowData.category.toLowerCase().includes('male'));
                const nameMatches = rowData.show && rowData.show.toLowerCase().includes(inputValue);
                return categoryMatches && nameMatches && self.findIndex((r) => r.show === rowData.show) === index;
              });
              break;
            case 'show':
              filteredData = data.filter((rowData, index, self) => {
                const categoryMatches = rowData.category && rowData.category.toLowerCase().includes('series') && (!rowData.category.toLowerCase().includes('female') && !rowData.category.toLowerCase().includes('male'));
                const nameMatches = rowData.show && rowData.show.toLowerCase().includes(inputValue);
                return categoryMatches && nameMatches && self.findIndex((r) => r.show === rowData.show) === index;
              });
              break;
            default:
              break;
          }
  
          const dropdownContainer = document.createElement('div');
          dropdownContainer.classList.add('autocompleteSearch-items');
  
          filteredData.forEach((rowData) => {
            const item = document.createElement('div');
            switch (dataKey) {
                case 'actor':
                    collum = 'full_name';
                    break;
                case 'movie':
                case 'show':
                    collum = 'show'
                    break;
                default:
                    break;
            }
            item.innerHTML = rowData[collum];
            item.classList.add('autocompleteSearch-item');
  
            item.addEventListener('click', () => {
              input.value = rowData[collum];
              closeAllLists();
              //loadPage(input.value, dataKey);
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
        document.addEventListener('click', () => closeAllLists());
      };
  
      const actorInputElement = document.getElementById('actor-autocomplete-input');
      const actorDropdownElement = document.getElementById('actor-autocomplete-dropdown');
      if (actorInputElement && actorDropdownElement) {
        initAutocomplete(actorInputElement, actorDropdownElement, 'actor');
      }
  
      const movieInputElement = document.getElementById('movie-autocomplete-input');
      const movieDropdownElement = document.getElementById('movie-autocomplete-dropdown');
      if (movieInputElement && movieDropdownElement) {
        initAutocomplete(movieInputElement, movieDropdownElement, 'movie');
      }
  
      const showInputElement = document.getElementById('show-autocomplete-input');
      const showDropdownElement = document.getElementById('show-autocomplete-dropdown');
      if (showInputElement && showDropdownElement) {
        initAutocomplete(showInputElement, showDropdownElement, 'show');
      }
  
    } catch (error) {
      console.error(error);
    }
    
    const validActor = (actor) => {
        if (actor.trim() === '') {
            return false;
        }
        
        const foundActor = data.find((rowData) => {
            return (
            rowData.full_name &&
            rowData.full_name.toLowerCase() === actor.toLowerCase() &&
            (rowData.category.toLowerCase().includes('actor') ||
                rowData.category.toLowerCase().includes('female') ||
                rowData.category.toLowerCase().includes('male'))
            );
        });
        
        return foundActor !== undefined;
    };

    const validMovie = (movie) => {
        if (movie.trim() === '') {
          return false;
        }
      
        const foundMovie = data.find((rowData) => {
          return (
            rowData.show &&
            rowData.show.toLowerCase() === movie.toLowerCase() &&
            rowData.category.toLowerCase().includes('motion picture') &&
            !rowData.category.toLowerCase().includes('female') &&
            !rowData.category.toLowerCase().includes('male')
          );
        });
      
        return foundMovie !== undefined;
    };
      
    const validShow = (show) => {
        if (show.trim() === '') {
          return false;
        }
      
        const foundShow = data.find((rowData) => {
          return (
            rowData.show &&
            rowData.show.toLowerCase() === show.toLowerCase() &&
            rowData.category.toLowerCase().includes('series') &&
            !rowData.category.toLowerCase().includes('female') &&
            !rowData.category.toLowerCase().includes('male')
          );
        });
      
        return foundShow !== undefined;
    };
      
    const loadPage = (key, type) => {
        switch (type) {
          case 'actor':
            if (validActor(key)) {
              window.location.href = 'templateActorpage.html?search=' + encodeURIComponent(key);
            } else {
              window.location.href = '404errorpage.html';
            }
            break;
          case 'movie':
            if (validMovie(key)) {
              window.location.href = 'templateMoviepage.html?search=' + encodeURIComponent(key);
            } else {
              window.location.href = '404errorpage.html';
            }
            break;
          case 'show':
            if (validShow(key)) {
              window.location.href = 'templateTVshowpage.html?search=' + encodeURIComponent(key);
            } else {
              window.location.href = '404errorpage.html';
            }
            break;
          default:
            break;
        }
    };

    let input;
    let type;
    const actorInputElement = document.getElementById('actor-autocomplete-input');
    if (actorInputElement) {
        input=actorInputElement;
        type='actor';
    }

    const movieInputElement = document.getElementById('movie-autocomplete-input');
    if (movieInputElement) {
        input=movieInputElement;
        type='movie';
    }

    const showInputElement = document.getElementById('show-autocomplete-input');
    if (showInputElement) {
        input=showInputElement;
        type='show';
    }

    const searchButton = document.querySelector('.searchButton');
        if (searchButton) {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            const key = input.value.trim();
            loadPage(key, type);
        });
        }
    };
  

  
  fetchData();
  