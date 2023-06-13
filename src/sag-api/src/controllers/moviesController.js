const fs = require('fs');
const csv = require('csv-parser');

let movieData = [];

function loadMoviesData() {
    return new Promise((resolve, reject) => {
      const uniqueNominations = {};
  
      fs.createReadStream('../data/screen_actor_guild_awards.csv')
        .pipe(csv())
        .on('data', (row) => {
          if (row.category.toLowerCase().includes('motion picture')) {
            const [year, edition] = row.year.split(' - ');
            const movieName = row.show.trim();
            const full_name = row.full_name.trim();
            const category = row.category;
  
            if (!full_name || !uniqueNominations[movieName]?.[year]?.includes(category)) {
              const nomination = {
                year: year.split(' ')[0],
                edition: year.split(' ')[1],
                category: category,
                won: row.won
              };
  
              const existingMovie = movieData.find((movie) => movie.name === movieName);
  
              if (existingMovie) {
                existingMovie.nominations.push(nomination);
                existingMovie.nominationCount = existingMovie.nominations.length;
                if (nomination.won == 'True') {
                  existingMovie.winCount++;
                }
              } else {
                const movie = {
                  name: movieName,
                  nominations: [nomination],
                  nominationCount: 1,
                  winCount: nomination.won == 'True' ? 1 : 0
                };
                movieData.push(movie);
              }
  
              if (!uniqueNominations[movieName]) {
                uniqueNominations[movieName] = {};
              }
              if (!uniqueNominations[movieName][year]) {
                uniqueNominations[movieName][year] = [];
              }
              uniqueNominations[movieName][year].push(category);
            }
          }
        })
        .on('end', () => {
          console.log('CSV data loaded successfully');
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
  
  


exports.initializeMoviesData = async () => {
  try {
    await loadMoviesData();
  } catch (error) {
    console.error('Failed to load movies data', error);
  }
};

exports.getMoviesNominationStatistics = (req, res) => {
    try {
      const nominationStatistics = movieData.reduce((acc, movie) => {
        movie.nominations.forEach((nomination) => {
          const { year, category, show } = nomination;
          const key = `${year}-${category}`;
  
          if (!acc[key]) {
            acc[key] = {
              year,
              category,
              nominees: [],
              winner: null
            };
          }
  
          acc[key].nominees.push({ name: movie.name });
  
          if (nomination.won === 'True') {
            acc[key].winner = movie.name;
          }
        });
  
        return acc;
      }, {});
  
      const nominationStatisticsList = Object.values(nominationStatistics);
  
      res.json(nominationStatisticsList);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


exports.getAllMovies = (req, res) => {
  try {
    res.json(movieData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMoviesByName = (req, res) => {
  const { name } = req.params;
  const moviesByName = movieData.find((movie) => movie.name.toLowerCase() === name.toLowerCase());

  if (moviesByName.length === 0) {
    return res.status(404).json({ error: 'No movies found with the given name' });
  }

  res.json(moviesByName);
};
