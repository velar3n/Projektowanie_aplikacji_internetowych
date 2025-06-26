require("dotenv").config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const recipeRoutes = require('./routes/recipeRoutes');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `/`;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.baseUrl19 = BASE_URL;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
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
      console.log(`Server running at http://localhost:${PORT}${BASE_URL}`);
    });
  })
  .catch(err => {
    console.error('Database  connection error:', err);
  });
