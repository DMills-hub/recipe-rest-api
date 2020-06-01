const Recipe = require("../models/Recipe");

exports.save = async (req, res) => {
  try {
    const { title, imageUri, ingredients, instructions, userId } = req.body;
    const newRecipe = new Recipe(
      null,
      userId,
      title,
      ingredients,
      imageUri,
      instructions
    );
    const attemptSave = await newRecipe.save();
    res.json({ attemptSave });
  } catch (err) {
    res.json({ error: "Something went wrong... try again?" });
  }
};
