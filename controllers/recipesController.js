const Recipe = require("../models/Recipe");

exports.save = async (req, res) => {
  try {
    const { title, ingredients, instructions, userId, base64, cookTime, prepTime, category } = req.body;
    const newRecipe = new Recipe(
      null,
      userId,
      title,
      ingredients,
      base64,
      instructions,
      cookTime,
      prepTime,
      category
    );
    const attemptSave = await newRecipe.save();
    res.json({ ...attemptSave });
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong... try again?" });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.allRecipes();
    res.json({ ...allRecipes });
  } catch (err) {
    res.json({ error: "Something went wrong... try again?" });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const { userId } = req.params;
    const myRecipes = await Recipe.myRecipes(userId);
    res.json(myRecipes);
  } catch (err) {
    res.json({ error: "Something went wrong... try again?" });
  }
};

exports.getSingleRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipeContents = await Recipe.recipeContents(recipeId);
    res.json(recipeContents);
  } catch (err) {
    console.log(err);
  }
}
