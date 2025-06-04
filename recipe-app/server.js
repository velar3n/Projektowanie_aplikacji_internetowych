const express = require('express');
const dotenv = require("dotenv").config();

const app = express();

const PORT = process.env.PORT
const recipeRoutes = require('./routes/recipes');

app.use(express.json());
app.use('/api/recipes', recipeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
