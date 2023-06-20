const fs = require('fs');
const csv = require('csv-parser');

let seriesData = [];

function loadSeriesData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('./sag-api/data/screen_actor_guild_awards.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.category.toLowerCase().includes('series')&&row.full_name.toLowerCase().length==0&& !(row.category.toLowerCase().includes('male') || row.category.toLowerCase().includes('female'))) {
          const [year, edition] = row.year.split(' - ');
          const seriesName = row.show;

          const nomination = {
            year: year.split(' ')[0],
            edition: year.split(' ')[1],
            category: row.category,
            won: row.won 
          };
        
          const existingSeries = seriesData.find((series) => series.name === seriesName);
          if (existingSeries) {
            existingSeries.nominations.push(nomination);
            existingSeries.nominationCount = existingSeries.nominations.length;
            if (nomination.won=='True') {
              existingSeries.winCount++;
            }
          } else {
            const series = {
              name: seriesName,
              nominations: [nomination],
              nominationCount: 1,
              winCount: nomination.won == 'True' ? 1 : 0
            };
            seriesData.push(series);
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

exports.initializeSeriesData = async () => {
  try {
    await loadSeriesData();
  } catch (error) {
    console.error('Failed to load series data', error);
  }
};

exports.getSeriesNominationStatistics = (req, res) => {
    try {
      const nominationStatistics = seriesData.reduce((acc, series) => {
        series.nominations.forEach((nomination) => {
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
  
          acc[key].nominees.push({ name: series.name });
  
          if (nomination.won == 'True') {
            acc[key].winner = series.name;
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


exports.getAllSeries = (req, res) => {
  try {
    res.json(seriesData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSeriesByYear = (req, res) => {
  const { year } = req.params;
  const seriesByYear = seriesData.filter((series) => series.year === year.trim());

  if (seriesByYear.length === 0) {
    return res.status(404).json({ error: 'No series found for the given year' });
  }

  res.json(seriesByYear);
};

exports.getSeriesByCategory = (req, res) => {
  const { category } = req.params;
  const seriesByCategory = seriesData.filter(
    (series) => series.category.toLowerCase() === category.toLowerCase().trim()
  );

  if (seriesByCategory.length === 0) {
    return res.status(404).json({ error: 'No series found for the given category' });
  }

  res.json(seriesByCategory);
};

exports.getSeriesByName = (req, res) => {
  const { name } = req.params;
  const seriesByName = seriesData.filter((series) => series.name.toLowerCase() === name.toLowerCase());

  if (seriesByName === '') {
    return res.status(404).json({ error: 'No series found with the given name' });
  }

  res.json(seriesByName);
};
