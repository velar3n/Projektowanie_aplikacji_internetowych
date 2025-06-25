require("dotenv").config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const recipeRoutes = require('./routes/recipeRoutes');
const sequelize = require('./sequelize');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || '/p19';

app.use((req, res, next) => {
  res.locals.baseUrl = BASE_URL;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

app.use(BASE_URL, recipeRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('SQLite connected');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}${BASE_URL}`);
    });
  })
  .catch(err => {
    console.error('SQLite connection error:', err);
  });
