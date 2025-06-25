require("dotenv").config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const recipeRoutes = require('./routes/recipeRoutes');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

app.use('/', recipeRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}$`);
    });
  })
  .catch(err => {
    console.error('Database  connection error:', err);
  });
