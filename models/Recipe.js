const pool = require("../util/db");
const format = require("pg-format");
const fs = require("fs");
const { uuid } = require("uuidv4");

class Recipe {
  constructor(
    id,
    userId,
    title,
    ingredients,
    image,
    instructions,
    cookTime,
    prepTime,
    category
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.ingredients = ingredients;
    this.image = image;
    this.instructions = instructions;
    this.cookTime = cookTime;
    this.prepTime = prepTime;
    this.category = category;
  }

  static async recipeContents(recipeId) {
    try {
      const client = await pool.connect();
      const ingredients = await client.query(
        "SELECT id, ingredient FROM ingredients WHERE recipe_id = $1",
        [recipeId]
      );
      const instructions = await client.query(
        "SELECT id, instruction FROM instructions WHERE recipe_id = $1",
        [recipeId]
      );
      if (ingredients.rowCount === 0 || instructions.rowCount === 0)
        return { error: "Couldn't find either ingredients or instructions." };
      return {
        success: true,
        ingredients: ingredients.rows,
        instructions: instructions.rows,
      };
    } catch (err) {
      console.log(err);
      return { error: "Something went wrong... try again?" };
    }
  }

  static async myRecipes(userId) {
    try {
      const client = await pool.connect();
      const recipes = await client.query(
        "SELECT * FROM recipes WHERE user_id = $1;",
        [userId]
      );
      client.release();
      if (recipes.rowCount === 0) return { error: "No recipes found..." };
      return { success: true, myRecipes: recipes.rows };
    } catch (err) {
      return { error: "Something went wrong... try again?" };
    }
  }

  static async allRecipes(category) {
    try {
      const client = await pool.connect();
      const results = await client.query("SELECT * FROM recipes WHERE category = $1", [category]);
      client.release();
      const recipes = results.rows;
      return { success: true, recipes: recipes };
    } catch (err) {
      return { error: "Something went wrong... try again?" };
    }
  }

  async save() {
    try {
      const client = await pool.connect();
      const newImageName = uuid();
      fs.writeFile(
        `${__dirname}/../images/${newImageName}.jpeg`,
        this.image,
        "base64",
        (err) => {
          if (err) return { error: "Couldn't save your image... try again?" };
        }
      );
      const addRecipe = await client.query(
        "INSERT INTO recipes (user_id, title, image, cookTime, prepTime, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID;",
        [
          this.userId,
          this.title,
          `${newImageName}.jpeg`,
          this.cookTime,
          this.prepTime,
          this.category
        ]
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
      console.log(err);
      return { error: "Something went wrong... try again?" };
    }
  }
}

module.exports = Recipe;
