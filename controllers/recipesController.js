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

exports.updateInstruction = async (req, res) => {
  try {
    const { id, instruction } = req.body;
    const updateInstruction = await Recipe.updateInstruction(id, instruction);
    res.json(updateInstruction);
  } catch (err) {
    res.json(errorMessage);
  }
}


exports.addIngredient = async (req, res) => {
  try {
    const { recipeId, ingredient, id } = req.body;
    const addIngredient = await Recipe.addIngredient(recipeId, ingredient, id);
    res.json(addIngredient);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.addInstruction = async (req, res) => {
  try {
    const { recipeId, instruction, id } = req.body;
    const addInstruction = await Recipe.addInstruction(recipeId, instruction, id);
    res.json(addInstruction);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.updateTitle = async (req, res) => {
  try {
    const { recipeId, title } = req.body;
    const updateTitle = await Recipe.updateTitle(recipeId, title);
    res.json(updateTitle);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.deleteIngredient = async (req, res) => {
  try {
    const { id } = req.body;
    const deleteIngredient = await Recipe.deleteIngredient(id);
    res.json(deleteIngredient);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.deleteInstruction = async (req, res) => {
  try {
    const { id } = req.body;
    const deleteInstruction = await Recipe.deleteInstruction(id);
    res.json(deleteInstruction)
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.updatePreptime = async (req, res) => {
  try {
    const { recipeId, preptime } = req.body;
    const updatePreptime = await Recipe.updatePreptime(recipeId, preptime);
    res.json(updatePreptime);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.updateServing = async (req, res) => {
  try {
    const { recipeId, serves } = req.body;
    const updateServing = await Recipe.updateServing(recipeId, serves);
    res.json(updateServing);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.updateCooktime = async (req, res) => {
  try {
    const { recipeId, cooktime } = req.body;
    const updateCooktime = await Recipe.updateCooktime(recipeId, cooktime);
    res.json(updateCooktime);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { recipeId, category } = req.body;
    const updateCategory = await Recipe.updateCategory(recipeId, category);
    res.json(updateCategory);
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