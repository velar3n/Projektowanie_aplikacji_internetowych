const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  instructions: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  time: Number,
  servings: Number,
  difficulty: String,
  photo_path: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
