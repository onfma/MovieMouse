
const apiUrl = 'http://localhost:3000/getCategories';
fetch(apiUrl)
  .then(response => response.json())
  .then(categoriesData => {
    categoriesData.categories.forEach(async category => {
      const categoryId = category.categoryId;
      const categoryName = category.categoryName;

      const canvasElement = document.createElement('canvas');
      const canvasId = `chart_${categoryId}`;
      canvasElement.setAttribute('id', canvasId);
      canvasElement.setAttribute('width', '400');
      canvasElement.setAttribute('height', '200');

      const chartsContainer = document.querySelector('.chartsConatiner');
      chartsContainer.appendChild(canvasElement);

      try {
        const nomineesResponse = await fetch(`http://localhost:3000/getCategoryNominees/${categoryId}`);
        const nomineesData = await nomineesResponse.json();
        const apiKey = '9d086ab036170e8ab7e68ab954be6f58'; 

        const nomineeNames = nomineesData.nominees.map(nominee => nominee);
        const names = await Promise.all(
            nomineesData.nominees.map(async nominee => {
              const personId = nominee;
              const personEndpoint = `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}`;
              const personResponse = await fetch(personEndpoint);
              const personData = await personResponse.json();
              return personData.name;
            })
          );
          console.log(names);
          
        const votesResponse = await fetch('http://localhost:3000/getVotes');
        const votesData = await votesResponse.json();
        const categoryVotes = votesData.votes.filter(vote => vote.categoryId === categoryId);

        const voteCounts = {};
        categoryVotes.forEach(vote => {
          const nomineeId = vote.actorId;
          if (voteCounts[nomineeId]) {
            voteCounts[nomineeId]++;
          } else {
            voteCounts[nomineeId] = 1;
          }
        });
        const backgroundColors = [
            'rgba(0, 20, 39, 0.2)',
            'rgba(112, 141, 129, 0.5)',
            'rgba(244, 213, 141, 0.5)',
            'rgba(191, 6, 3, 0.5)',
            'rgba(141, 8, 1, 0.5)',
          ];

        const data = nomineeNames.map(nomineeName => voteCounts[nomineeName] || 0);
        new Chart(canvasId, {
          type: 'bar',
          data: {
            labels: nomineeNames,
            datasets: [{
              label: `Votes for ${categoryName}`,
              data: data,
              backgroundColor: backgroundColors[categoryId % backgroundColors.length],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                stepSize: 1,
              },
              x: {
                ticks: {
                    callback: function(value, index, ticks) {
                        return names[value];
                    }
                }
              }
            },
          }
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });
  })
  .catch(error => {
    console.error('Error retrieving categories:', error);
  });

  
  const submitBtn = document.getElementById('submitbtm');
  submitBtn.onclick = async () => {
    const categoryName = document.getElementById('categoryNameInput').value;
    const actor1Id = document.getElementById('actor1Input').value;
    const actor2Id = document.getElementById('actor2Input').value;
    const actor3Id = document.getElementById('actor3Input').value;
    const actor4Id = document.getElementById('actor4Input').value;
  
    const message = document.getElementById("errorMessage");
    if (!categoryName || !actor1Id || !actor2Id || !actor3Id || !actor4Id) {
      message.textContent = 'Please fill in all the fields.';
      return;
    } else {
      message.textContent = '';
    }
  
    try {
      const categoryResponse = await fetch(`http://localhost:3000/addCategory/${categoryName}`);
      const categoryIdResponse = await fetch(`http://localhost:3000/categoryId/${categoryName}`);
      const f = await categoryIdResponse.json();
      categoryId = f.categoryId;
      console.log(categoryId);
  
      const addNominationPromises = [
        fetch(`http://localhost:3000/addNomination/${categoryId}/${actor1Id}`),
        fetch(`http://localhost:3000/addNomination/${categoryId}/${actor2Id}`),
        fetch(`http://localhost:3000/addNomination/${categoryId}/${actor3Id}`),
        fetch(`http://localhost:3000/addNomination/${categoryId}/${actor4Id}`)
      ];
  
      const addNominationResponses = await Promise.all(addNominationPromises);
  
      document.getElementById('categoryNameInput').value = '';
      document.getElementById('actor1Input').value = '';
      document.getElementById('actor2Input').value = '';
      document.getElementById('actor3Input').value = '';
      document.getElementById('actor4Input').value = '';
  
      message.textContent = 'Nominations added successfully!';
    } catch (error) {
      console.error('Error:', error);
      message.textContent = 'An error occurred. Please try again later.';
    }
  };

  const cat = document.getElementById('cat');
  cat.onclick = async () => {
    console.log("categoryId");
    const currentCategory = document.getElementById('currentCategoryInput').value;
    const f = await fetch(`http://localhost:3000/addNomination/setCat/${currentCategory}`);
  };
  