const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const actorsRoutes = require('./sag-api/src/routes/actorsRoutes');
const seriesRoutes = require('./sag-api/src/routes/seriesRoutes');
const moviesRoutes = require('./sag-api/src/routes/moviesRoutes');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './sag-api/data')));

app.get('/screen_actor_guild_awards.csv', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'screen_actor_guild_awards.csv');
  res.sendFile(filePath);
});

const db = new sqlite3.Database('./materiale/database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
    return;
  }
  console.log('Table created successfully');
});

app.use('/', actorsRoutes);
app.use('/', seriesRoutes);
app.use('/', moviesRoutes);

app.post('/add-account', (req, res) => {
  const { email, username, password } = req.body;
  
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      db.get('SELECT * FROM accounts WHERE username = ? OR email = ?', [username, email], (err, row) => {
        if (err) {
          console.error('Error querying accounts:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
    
        if (row) {
          console.error('An account with the same username or email already exists');
          res.status(400).send('An account with the same username or email already exists');
          return;
        }
    
        db.run('INSERT INTO accounts (email, username, password) VALUES (?, ?, ?)', [email, username, hash], (err) => {
          if (err) {
            console.error('Error inserting account:', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          console.log('Account inserted successfully');
          res.send('Account inserted successfully');
        });
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM accounts WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Error querying accounts:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (!row) {
      console.error('Account not found');
      res.status(401).send('Invalid email or password');
      return;
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (result) {
        console.log('Login successful');
        res.send('Login successful');
      } else {
        console.error('Invalid email or password');
        res.status(401).send('Invalid email or password');
      }
    });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});