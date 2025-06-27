const Recipe = require('../models/Recipe');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || `/`;


// logging operations to file

const logOperation = (operation, recipeId, details) => {
  const logDir = path.join(__dirname, '..', 'logs');
  const logFile = path.join(logDir, 'recipe_operations.log');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${operation} - Recipe ID: ${recipeId} - ${details}\n`;
  
  fs.appendFileSync(logFile, logEntry);
};


// ejs page controllers

exports.renderAllRecipesPage = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.render('recipes', { recipes });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.renderHomePage = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.render('home', { recipes });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.renderAddRecipeForm = (req, res) => {
  res.render('add_recipe', { recipe: null, isEdit: false });
};

exports.renderEditRecipeForm = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    res.render('add_recipe', { recipe, isEdit: true });
  } catch (err) {
    res.status(500).send('Server error');
  }
};


// api controllers

exports.createRecipe = async (req, res) => {
  try {
    const photoPath = req.file ? req.file.filename : null;
    const recipe = await Recipe.create({
      ...req.body,
      photo_path: photoPath
    });
    await recipe.save();
    
    logOperation('CREATE', recipe.id, `Created recipe: ${recipe.title}`);
    
    res.redirect(`${BASE_URL}/`);
  } catch (err) {
    const recipes = await Recipe.findAll();
    res.status(400).render('home', { 
      error: err.message, 
      formData: req.body,
      recipes: recipes,
      baseUrl19: BASE_URL
    });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "recipe_post_container" ? { where: { category } } : {};
    const recipes = await Recipe.findAll(filter);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).render('404');
    res.render('recipe_post', { recipe });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    let ingredients = req.body.ingredients;
    if (!ingredients) ingredients = [];
    else if (!Array.isArray(ingredients)) ingredients = [ingredients];

    let instructions = req.body.instructions;
    if (!instructions) instructions = [];
    else if (!Array.isArray(instructions)) instructions = [instructions];

    const updatedData = {
      ...req.body,
      ingredients,
      instructions,
    };

    if (req.file) {
      const oldRecipe = await Recipe.findByPk(req.params.id);
      if (oldRecipe && oldRecipe.photo_path) {
        const oldImagePath = path.join(__dirname, '..', 'public', 'images', oldRecipe.photo_path);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          logOperation('DELETE_IMAGE', req.params.id, `Deleted old image: ${oldRecipe.photo_path}`);
        }
      }
      updatedData.photo_path = req.file.filename;
    }

    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).render('404');
    await recipe.update(updatedData);

    logOperation('UPDATE', req.params.id, `Updated recipe: ${recipe.title}`);

    res.redirect(`${BASE_URL}/`);
  } catch (err) {
    const recipes = await Recipe.findAll();
    res.status(400).render('home', { 
      error: err.message, 
      formData: req.body,
      recipes: recipes,
      baseUrl19: BASE_URL
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    
    if (recipe.photo_path) {
      const imagePath = path.join(__dirname, '..', 'public', 'images', recipe.photo_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        logOperation('DELETE_IMAGE', req.params.id, `Deleted image: ${recipe.photo_path}`);
      }
    }
    
    logOperation('DELETE', req.params.id, `Deleted recipe: ${recipe.title}`);
    
    await recipe.destroy();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};