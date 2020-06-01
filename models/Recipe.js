const pool = require("../util/db");
const format = require("pg-format");

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
      const addRecipe = await client.query(
        "INSERT INTO recipes (user_id, title, image) VALUES ($1, $2, $3) RETURNING ID;",
        [this.userId, this.title, this.imageUri]
      );
      const recipe_id = addRecipe.rows[0].id;
      const newIngredients = this.ingredients.map((_, index) => {
        return [recipe_id, ...this.ingredients[index]];
      });
      const newInstructions = this.instructions.map((_, index) => {
        return [recipe_id, ...this.instructions[index]];
      });
      const ingredientsQuery = format(
        "INSERT INTO ingredients (recipe_id, ingredient) VALUES %L",
        newIngredients
      );
      const instructionsQuery = format(
        "INSERT INTO instructions (recipe_id, instruction) VALUES %L",
        newInstructions
      );
      await client.query(ingredientsQuery);
      await client.query(instructionsQuery);
      client.release();
      return { success: true, message: "Successfully added recipe!" };
    } catch (err) {
      return { error: "Something went wrong... try again?" };
    }
  }
}

module.exports = Recipe;
