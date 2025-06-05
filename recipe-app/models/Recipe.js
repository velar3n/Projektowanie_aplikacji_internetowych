const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  photo: String,
  instructions: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  time: Number,
  difficulty: Number,
  servings: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
