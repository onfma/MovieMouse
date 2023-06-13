const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actorsController');

actorsController.initializeActorsData()
  .then(() => {
    router.get('/actors', actorsController.getAllActors);
    router.get('/actors/name/:name', actorsController.getActorByName);
    router.get('/actors/male', actorsController.getMaleActors);
    router.get('/actors/female', actorsController.getFemaleActors);
    router.get('/actors/statistics', actorsController.getActorNominationStatistics);


    console.log('Actors data loaded successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize actors data', error);
  });

module.exports = router;
