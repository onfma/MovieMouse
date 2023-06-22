const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require("cookie-parser");
const ses = require('express-session');
const actorsRoutes = require('./sag-api/src/routes/actorsRoutes');
const seriesRoutes = require('./sag-api/src/routes/seriesRoutes');
const moviesRoutes = require('./sag-api/src/routes/moviesRoutes');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const oneDay = 1000 * 60 * 60 * 24;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './sag-api/data')));
app.use(cookieParser());
app.use(ses({
  secret: 'Fezulina-e-DrAgUt2256',
  resave: true,
  cookie: { maxAge: oneDay },
  saveUninitialized: true,
}));
var session = {
  authenticated: false,
  username: "",
  userId: ""
};
var currentCategoryId = {
  set: false,
  id: 2
};

const db = new sqlite3.Database('./materiale/database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    authenticated BOOLEAN DEFAULT 0
  )
`, (err) => {
  if (err) {
    console.error('Error creating "accounts" table:', err);
    return;
  }
  console.log('"accounts" table created successfully');
});

db.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryName TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating "categories" table:', err);
    return;
  }
  console.log('"categories" table created successfully');
});

db.run(`
  CREATE TABLE IF NOT EXISTS nominations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idActor INTEGER,
    idCategory INTEGER,
    FOREIGN KEY (idActor) REFERENCES accounts (id),
    FOREIGN KEY (idCategory) REFERENCES categories (id)
  )
`, (err) => {
  if (err) {
    console.error('Error creating "nominations" table:', err);
    return;
  }
  console.log('"nominations" table created successfully');
});

db.run(`
  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idUser INTEGER,
    idActor INTEGER,
    idCategory INTEGER,
    FOREIGN KEY (idUser) REFERENCES accounts (id),
    FOREIGN KEY (idActor) REFERENCES accounts (id),
    FOREIGN KEY (idCategory) REFERENCES categories (id),
    UNIQUE (idUser, idCategory)
  )
`, (err) => {
  if (err) {
    console.error('Error creating "votes" table:', err);
    return;
  }
  console.log('"votes" table created successfully');
});

app.post('/voteFor/:actorId', (req, res) => {
  
  const actorId = req.params.actorId;
  const userId = session.userId;
  const categoryId = currentCategoryId;
  console.log(actorId, userId, categoryId);
  db.get('SELECT * FROM votes WHERE idUser = ? AND idActor = ? AND idCategory = ?', [userId, actorId, categoryId.id], (err, row) => {
    if (err) {
      console.error('Error querying votes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (row) {
      res.status(400).json({ error: 'User has already voted for the actor in the category' });
      return;
    }
    db.run('INSERT INTO votes (idUser, idActor, idCategory) VALUES (?, ?, ?)', [userId, actorId, categoryId.id], function (err) {
      if (err) {
        console.error('Error inserting vote:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ message: 'Vote added successfully' });
    });
  });
});

app.post('/addCategory/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName;

  db.run('INSERT INTO categories (categoryName) VALUES (?)', [categoryName], function(err) {
    if (err) {
      console.error('Error adding category:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Category added successfully
    res.status(200).json({ message: 'Category added successfully' });
  });
});

app.post('/addNomination/:categoryId/:actorId', (req, res) => {
  const categoryId = req.params.categoryId;
  const actorId = req.params.actorId;
  console.log(categoryId, actorId);

  db.run('INSERT INTO nominations (categoryId, actorId) VALUES (?, ?)', [categoryId, actorId], function(err) {
    if (err) {
      console.error('Error adding nomination:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.sendStatus(200);
  });
});

app.get('/getVotes', (req, res) => {
  if (!session.authenticated) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  db.all('SELECT idUser, idActor, idCategory FROM votes', [], (err, rows) => {
    if (err) {
      console.error('Error querying votes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (rows.length > 0) {
      const votes = rows.map(row => ({
        userId: row.idUser,
        actorId: row.idActor,
        categoryId: row.idCategory
      }));
      res.json({ votes });
    } else {
      res.json({ votes: [] });
    }
  });
});

app.get('/getCategories', (req, res) => {
  if (!session.authenticated) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  db.all('SELECT id, categoryName FROM categories', [], (err, rows) => {
    if (err) {
      console.error('Error querying categories:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (rows.length > 0) {
      const categories = rows.map(row => ({
        categoryId: row.id,
        categoryName: row.categoryName
      }));
      res.json({ categories });
    } else {
      res.json({ categories: [] });
    }
  });
});

app.get('/getVoteFor/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const userId = session.userId;

  if (!session.authenticated) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }
  db.get('SELECT * FROM votes WHERE idUser = ? AND idCategory = ?', [userId, categoryId], (err, row) => {
    if (err) {
      console.error('Error querying votes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (row) {
      res.json({ voted: true, vote: row.idActor });
    } else {
      res.json({ voted: false });
    }
  });
});

app.get('/getCategoryNominees/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  db.all('SELECT idActor FROM nominations WHERE idCategory = ?', [categoryId], (err, rows) => {
    if (err) {
      console.error('Error querying nominations:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const nomineeIds = rows.map((row) => row.idActor);
    res.json({ category: categoryId, nominees: nomineeIds });
  });
});


app.get('/categoryWinner/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  db.get(
    `SELECT idActor FROM votes WHERE idCategory = ? GROUP BY idActor ORDER BY COUNT(*) DESC LIMIT 1`,
    [categoryId],
    (err, row) => {
      if (err) {
        console.error('Error getting category winner:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      if (row) {
        const winnerId = row.idActor;
        res.json({ winner: winnerId });
      } else {
        res.send(`No winner found for category ${categoryId}`);
      }
    }
  );
});

app.get('/categoryName/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  db.get('SELECT categoryName FROM categories WHERE id = ?', [categoryId], (err, row) => {
    if (err) {
      console.error('Error querying categories:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (row) {
      const categoryName = row.categoryName;
      res.json({ 
      categoryId: categoryId,
      categoryName: categoryName });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  });
});

app.get('/categoryId/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName;

  db.get('SELECT id FROM categories WHERE categoryName = ?', [categoryName], (err, row) => {
    if (err) {
      console.error('Error querying categories:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (row) {
      const categoryId = row.id;
      res.json({ categoryId });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  });
});
app.get('/getCat', (req, res) => {
  res.json({ 
    set: currentCategoryId.set,
    id: currentCategoryId.id
   });
});
app.get('/setCat/:id', (req, res) => {
  const id = req.params.id;
    currentCategoryId.set = true;
    currentCategoryId.id = id;
});

app.get('/check-authentication', (req, res) => {
  if (session.authenticated) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/get-user', (req, res) => {
  if (session.authenticated) {
    res.json({ 
      authenticated: true,
      userId: session.userId,
      username: session.username
    });
  } else {
    res.json({ authenticated: false });
  }
});


app.get('/screen_actor_guild_awards.csv', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'screen_actor_guild_awards.csv');
  res.sendFile(filePath);
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

        db.run('INSERT INTO accounts (email, username, password) VALUES (?, ?, ?)', [email, username, hash], function (err) {
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
        session.authenticated = true;
        session.username = row.username;
        session.userId = row.id;
        res.send('Login successful');
      } else {
        console.error('Invalid email or password');
        res.status(401).send('Invalid email or password');
      }
    });
  });
});

app.get('/logout', (req, res) => {
  session.authenticated = false;
  session.username = "";
  session.userId = "";

  req.session.destroy((err) => {
    if (err) {
      console.error('Error clearing session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/login');
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
