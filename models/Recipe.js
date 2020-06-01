const pool = require("../util/db");
const format = require('pg-format');

class Recipe {
  constructor(id, userId, title, ingredients, imageUri, instructions) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.ingredients = ingredients;
    this.imageUri = imageUri;
    this.instructions = instructions;
  }

  async save() {
    try {
      const client = await pool.connect();
      const getAllRecipes = await client.query("SELECT * FROM recipes");
      const recipe_id = getAllRecipes.rowCount + 1;
      await client.query(
        "INSERT INTO recipes (id, user_id, title, image) VALUES ($1, $2, $3, $4);",
        [recipe_id, this.userId, this.title, this.imageUri]
      );
      // this.ingredients.forEach(async (ing) => {
      //   try {
      //     const allIngredients = await client.query(
      //       "SELECT * FROM ingredients"
      //     );
      //     const newId = allIngredients.rowCount + 1;
      //     await client.query(
      //       "INSERT INTO ingredients (id, recipe_id, ingredient) VALUES ($1, $2, $3)",
      //       [newId, recipe_id, ing.ing]
      //     );
      //   } catch (err) {
      //     return { error: "Had an issue inserting ingredients..." };
      //   }
      // });
      // this.instructions.forEach(async (ins) => {
      //   try {
      //     const allInstructions = await client.query(
      //       "SELECT * FROM instructions"
      //     );
      //     const newId = allInstructions.rowCount + 1;
      //     await client.query(
      //       "INSERT INTO instructions (id, recipe_id, instruction) VALUES ($1, $2, $3)",
      //       [newId, recipe_id, ins.instruction]
      //     );
      //   } catch (err) {
      //     return { error: "Had an issue inserting instructions..." };
      //   }
      // });
      client.release();
      return { success: true, message: "Successfully added recipe!" };
    } catch (err) {
      return { error: "Something went wrong... try again?" };
    }
  }
}

module.exports = Recipe;
