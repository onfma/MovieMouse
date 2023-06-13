const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

moviesController.initializeMoviesData()
  .then(() => {
    router.get('/movies', moviesController.getAllMovies);
    router.get('/movies/name/:name', moviesController.getMoviesByName);
    router.get('/movies/statistics', moviesController.getMoviesNominationStatistics);

    console.log('Movies data loaded successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize movies data', error);
  });

module.exports = router;
