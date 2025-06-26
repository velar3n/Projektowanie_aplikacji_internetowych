const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const recipeController = require('../controllers/recipeController');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


// ejs routes
router.get('/recipes', recipeController.renderAllRecipesPage);
router.get('/', recipeController.renderHomePage);
router.get('/recipes_add', recipeController.renderAddRecipeForm);
router.get('/recipes/:id/edit', recipeController.renderEditRecipeForm);

// api routes
router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.delete('/recipes/:id', recipeController.deleteRecipe);
router.put('/recipes/:id', upload.single('photo'), recipeController.updateRecipe);
router.post('/recipes_add', upload.single('photo'), recipeController.createRecipe);

module.exports = router;