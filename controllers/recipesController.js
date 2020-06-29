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
      serves,
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
      serves,
      category,
      publishable
    );
    const attemptSave = await newRecipe.save();
    res.json(attemptSave);
  } catch (err) {
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


exports.updateImage = async (req, res) => {
  try {
    const { recipeId, base64 } = req.body;
    const updateImage = await Recipe.updateImage(recipeId, base64);
    res.json(updateImage);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.addReview = async (req, res) => {
  try {
    const { recipeId, review, rating, userId, title } = req.body;
    const addReview = await Recipe.addReview(recipeId, review, rating, userId, title);
    res.json(addReview);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.getReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const getReviews = await Recipe.getReviews(recipeId);
    res.json(getReviews);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.updateIngredient = async (req, res) => {
  try {
    const { id, ingredient } = req.body;
    const updateIngredient = await Recipe.updateIngredient(id, ingredient);
    res.json(updateIngredient);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.searchRecipe = async (req, res) => {
  try {
    const { category, title } = req.params;
    const searchedRecipes = await Recipe.searchedRecipes(category, title);
    res.json(searchedRecipes);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.searchMyRecipe = async (req, res) => {
  try {
    const { userId, title } = req.params;
    const searchMyRecipes = await Recipe.searchMyRecipes(userId, title);
    res.json(searchMyRecipes);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.updateRecipe = async (req, res) => {
  try {
    const { title, image, newIngredients, newInstructions, cookTime, prepTime, serves, category, id } = req.body;
    const updateRecipe = await Recipe.updateRecipe(title, image, newIngredients, newInstructions, cookTime, prepTime, serves, category, id);
    res.json(updateRecipe);
  } catch (err) {
    res.json(errorMessage);
  }
}