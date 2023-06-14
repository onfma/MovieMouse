const express = require('express');
const cors = require('cors');
const actorsRoutes = require('./routes/actorsRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const moviesRoutes = require('./routes/moviesRoutes');

const app = express();
app.use(express.static('public'));

app.use(cors());
app.use('/', actorsRoutes);
app.use('/', seriesRoutes);
app.use('/', moviesRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
