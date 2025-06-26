const Recipe = require('../models/Recipe');
const baseUrl = "<%= baseUrl19 %>";

// ========== PAGE CONTROLLERS (EJS) ==========

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

// ========== API CONTROLLERS (JSON) ==========

exports.createRecipe = async (req, res) => {
  try {
    const photoPath = req.file ? req.file.filename : null;
    const recipe = await Recipe.create({
      ...req.body,
      photo_path: photoPath
    });
    await recipe.save();
    res.redirect(`${baseUrl}/recipes/${recipe.id}`);
  } catch (err) {
    res.status(400).render('add_recipe', { 
      error: err.message, 
      formData: req.body 
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

    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).render('404');
    await recipe.update(updatedData);

    res.redirect(`${baseUrl}/recipes/${recipe.id}`);
  } catch (err) {
    res.status(400).render('recipes', { 
      error: err.message, 
      formData: req.body 
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    await recipe.destroy();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};