const fs = require('fs');
const csv = require('csv-parser');

let actorsData = [];

function loadActorsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('../data/screen_actor_guild_awards.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.category.toLowerCase().includes('actor')||row.category.toLowerCase().includes('female')||row.category.toLowerCase().includes('male')) {
          const [year, edition] = row.year.split(' - ');
          const actorName = row.full_name;
          const actorGender = row.category.split(' ')[1].toLowerCase();

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

exports.getActorNominationStatistics = (req, res) => {
  try {
    const nominationStatistics = actorsData.reduce((acc, actor) => {
      actor.nominations.forEach((nomination) => {
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

        acc[key].nominees.push({ name: actor.name, show });

        if (nomination.won == 'True') {
          acc[key].winner = actor.name;
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



exports.getAllActors = (req, res) => {
  try {
    res.json(actorsData);
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
