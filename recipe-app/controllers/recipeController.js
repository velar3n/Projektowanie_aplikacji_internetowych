const Recipe = require('../models/Recipe');

// ========== PAGE CONTROLLERS (EJS) ==========

exports.renderAllRecipesPage = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('recipes', { recipes });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.renderHomePage = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('home', { recipes });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.renderAddRecipeForm = (req, res) => {
  res.render('add_recipe', { recipe: null, isEdit: false });
};

exports.renderEditRecipeForm = async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    res.render('add_recipe', { recipe, isEdit: true });
};

// ========== API CONTROLLERS (JSON) ==========

exports.createRecipe = async (req, res) => {
  try {
    const photoPath = req.file ? req.file.filename : null;
    const recipe = new Recipe({
      ...req.body,
      photo_path: photoPath
    });
    await recipe.save();

    res.redirect(`/recipes/${recipe._id}`);
  } catch (err) {
    res.status(400).render('add_recipe', { 
      error: err.message, 
      formData: req.body });
  }
};


exports.getAllRecipes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "recipe_post_container" ? { category } : {};
    const recipes = await Recipe.find(filter);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).render('404');
    res.render('recipe_post', { recipe });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateRecipe = async (req, res) => {
  try {
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
      updatedData.photo_path = req.file.filename;
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.redirect(`/recipes/${recipe._id}`);
  } catch (err) {
    res.status(400).render('recipes', { 
      error: err.message, 
      formData: req.body });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};