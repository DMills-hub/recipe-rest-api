const Recipe = require("../models/Recipe");
const { errorMessage } = require("../helpers/errorMessage");

exports.save = async (req, res) => {
  try {
    const {
      title,
      ingredients,
      instructions,
      userId,
      base64,
      cookTime,
      prepTime,
      category,
      publishable
    } = req.body;
    const newRecipe = new Recipe(
      null,
      userId,
      title,
      ingredients,
      base64,
      instructions,
      cookTime,
      prepTime,
      category,
      publishable
    );
    const attemptSave = await newRecipe.save();
    res.json(attemptSave);
  } catch (err) {
    console.log(err);
    res.json(errorMessage);
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const deleteRecipe = await Recipe.deleteRecipe(recipeId);
    res.json(deleteRecipe)
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.getAllRecipes = async (req, res) => {
  try {
    const { category } = req.params;
    const allRecipes = await Recipe.allRecipes(category);
    res.json(allRecipes);
  } catch (err) {
    res.json(errorMessage);
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const { userId } = req.params;
    const myRecipes = await Recipe.myRecipes(userId);
    res.json(myRecipes);
  } catch (err) {
    res.json(errorMessage);
  }
};

exports.getSingleRecipe = async (req, res) => {
  try {
    const { recipeId, userId } = req.params;
    const recipeContents = await Recipe.recipeContents(recipeId, userId);
    res.json(recipeContents);
  } catch (err) {
    res.json(errorMessage);
  }
};

exports.addFavourite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const addFavourite = await Recipe.addFavourite(userId, recipeId);
    res.json(addFavourite);
  } catch (err) {
    res.json(errorMessage);
  }
};

exports.deleteFavourite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const deleteFavourite = await Recipe.deleteFavourite(userId, recipeId);
    res.json(deleteFavourite);
  } catch (err) {
    res.json(errorMessage);
  }
};

exports.getMyFavourites = async (req, res) => {
  try {
    const { userId } = req.params;
    const getMyFavourites = await Recipe.getMyFavourites(userId);
    res.json(getMyFavourites);
  } catch (err) {
    res.json(errorMessage);
  }
};
