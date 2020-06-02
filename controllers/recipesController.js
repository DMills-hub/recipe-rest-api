const Recipe = require("../models/Recipe");

exports.save = async (req, res) => {
  try {
    const { title, ingredients, instructions, userId, base64 } = req.body;
    const newRecipe = new Recipe(
      null,
      userId,
      title,
      ingredients,
      base64,
      instructions
    );
    const attemptSave = await newRecipe.save();
    res.json({ ...attemptSave });
  } catch (err) {
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
