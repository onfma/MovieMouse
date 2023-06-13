const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');

seriesController.initializeSeriesData()
  .then(() => {
    router.get('/series', seriesController.getAllSeries);
    router.get('/series/year/:year', seriesController.getSeriesByYear);
    router.get('/series/category/:category', seriesController.getSeriesByCategory);
    router.get('/series/name/:name', seriesController.getSeriesByName);
    router.get('/series/statistics', seriesController.getSeriesNominationStatistics);

    console.log('Series data loaded successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize series data', error);
  });

module.exports = router;
