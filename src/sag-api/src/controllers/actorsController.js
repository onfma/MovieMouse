const fs = require('fs');
const csv = require('csv-parser');
let actorsData = [];

function loadActorsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('./sag-api/data/screen_actor_guild_awards.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.category.toLowerCase().includes('actor')||row.category.toLowerCase().includes('female')||row.category.toLowerCase().includes('male')) {
          const [year, edition] = row.year.split(' - ');
          const actorName = row.full_name;
          const actorGender = row.category.toLowerCase().includes('female') ? 'female' : 'male';

          const nomination = {
            year: year.split(' ')[0],
            edition: year.split(' ')[1],
            category: row.category,
            show: row.show,
            won: row.won 
          };

          const existingActor = actorsData.find(actor => actor.name === actorName);
          if (existingActor) {
            existingActor.nominations.push(nomination);
            existingActor.nominationCount = existingActor.nominations.length;
            if (nomination.won=='True') {
              existingActor.winCount++;
            }
          } else {
            const actor = {
              name: actorName,
              gender: actorGender,
              nominations: [nomination],
              nominationCount: 1,
              winCount: nomination.won == 'True' ? 1 : 0
            };
            actorsData.push(actor);
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

exports.initializeActorsData = async () => {
  try {
    await loadActorsData();
  } catch (error) {
    console.error('Failed to load actors data', error);
  }
};

exports.getAllActors = (req, res) => {
  try {
    res.json(actorsData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getActorNominationStatistics = (req, res) => {
  try {
    const nominationStatistics = actorsData.reduce((acc, actor) => {
      actor.nominations.forEach((nomination) => {
        const { year, category, show } = nomination;

        if (!acc[year]) {
          acc[year] = {};
        }

        if (!acc[year][category]) {
          acc[year][category] = {
            nominees: [],
            winner: null
          };
        }

        acc[year][category].nominees.push({ name: actor.name, show });

        if (nomination.won == 'True') {
          acc[year][category].winner = actor.name;
        }
      });

      return acc;
    }, {});

    res.json(nominationStatistics);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getActorStatisticsByYear = (req, res) => {
  try {
    const { year } = req.params;

    const nominationStatistics = actorsData.reduce((acc, actor) => {
      actor.nominations.forEach((nomination) => {
        if (nomination.year === year) {
          const { category, show } = nomination;

          if (!acc[category]) {
            acc[category] = {
              nominees: [],
              winner: null
            };
          }

          acc[category].nominees.push({ name: actor.name, show });

          if (nomination.won === 'True') {
            acc[category].winner = actor.name;
          }
        }
      });

      return acc;
    }, {});

    res.json(nominationStatistics);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getActorByName = (req, res) => {
  const { name } = req.params;
  const actorsByName = actorsData.find((actor) => actor.name.toLowerCase() === name.toLowerCase());

  if (actorsByName.length === 0) {
    return res.status(404).json({ error: 'No movies found with the given name' });
  }

  res.json(actorsByName);

};

exports.getFemaleActors = (req, res) => {
  try {
    const femaleActors = actorsData.filter((actor) => actor.gender === 'female');
    res.json(femaleActors);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMaleActors = (req, res) => {
  try {
    const maleActors = actorsData.filter((actor) => actor.gender === 'male');
    res.json(maleActors);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
