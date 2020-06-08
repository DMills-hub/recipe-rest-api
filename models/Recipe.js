const pool = require("../util/db");
const format = require("pg-format");
const fs = require("fs");
const { uuid } = require("uuidv4");
const { errorMessage } = require("../helpers/errorMessage");

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
    category,
    publishable
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
    this.publishable = publishable;
  }

  static async getReviews(recipeId) {
    try {
      const client = await pool.connect();
      const reviews = await client.query(
        "SELECT reviews.title, reviews.review, reviews.rating, users.username FROM reviews INNER JOIN users ON users.id = reviews.user_id WHERE reviews.recipe_id = $1;",
        [recipeId]
      );
      client.release();
      return { success: true, reviews: reviews.rows };
    } catch (err) {
      return errorMessage;
    }
  }

  static async addReview(recipeId, review, rating, userId, title) {
    try {
      const client = await pool.connect();
      await client.query(
        "INSERT INTO reviews (review, rating, title, recipe_id, user_id) VALUES ($1, $2, $3, $4, $5)",
        [review, rating, title, recipeId, userId]
      );
      client.release();
      return { success: true, message: "Successfully added review." };
    } catch (err) {
      console.log(err);
      return errorMessage;
    }
  }

  static async updateImage(recipeId, base64) {
    try {
      const client = await pool.connect();
      const id = uuid();
      await client.query("UPDATE recipes SET image = $1 WHERE id = $2", [
        `${id}.jpeg`,
        recipeId,
      ]);
      fs.writeFile(
        `${__dirname}/../images/${id}.jpeg`,
        base64,
        "base64",
        (err) => {
          if (err) return { error: "Couldn't save your image... try again?" };
        }
      );
      return { success: true, message: "Image updated." };
    } catch (err) {
      return errorMessage;
    }
  }

  static async deleteRecipe(recipeId) {
    try {
      const client = await pool.connect();
      const image = await client.query(
        "DELETE FROM recipes WHERE id = $1 RETURNING image",
        [recipeId]
      );
      if (image !== "") {
        fs.unlink(`${__dirname}/../images/${image}`, (err) => {
          if (err) return { error: "Couldn't delete image... try again?" };
        });
      }
      client.release();
      return { success: true, message: "Successfully deleted recipe." };
    } catch (err) {
      return errorMessage;
    }
  }

  static async getMyFavourites(userId) {
    try {
      const client = await pool.connect();
      const myFavourites = await client.query(
        "SELECT recipes.id, recipes.user_id, recipes.title, recipes.image, recipes.cooktime, recipes.preptime, recipes.category FROM favourites INNER JOIN recipes ON recipes.id = favourites.recipe_id WHERE favourites.user_id = $1;",
        [userId]
      );
      client.release();
      return { success: true, myFavourites: myFavourites.rows };
    } catch (err) {
      return errorMessage;
    }
  }

  static async deleteFavourite(userId, recipeId) {
    try {
      const client = await pool.connect();
      await client.query(
        "DELETE FROM favourites WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId]
      );
      client.release();
      return { success: true, message: "Deleted recipe from your favourites" };
    } catch (err) {
      return errorMessage;
    }
  }

  static async addFavourite(userId, recipeId) {
    try {
      const client = await pool.connect();
      await client.query(
        "INSERT INTO favourites (user_id, recipe_id) VALUES ($1, $2);",
        [userId, recipeId]
      );
      client.release();
      return { success: true, message: "Added recipe to your favourites." };
    } catch (err) {
      return errorMessage;
    }
  }

  static async recipeContents(recipeId, userId) {
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
      const isFav = await client.query(
        "SELECT * FROM favourites WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId]
      );
      const reviews = await client.query(
        "SELECT * FROM reviews WHERE recipe_id = $1",
        [recipeId]
      );
      const isReviewed = await client.query(
        "SELECT * FROM reviews WHERE recipe_id = $1 AND user_id = $2",
        [recipeId, userId]
      );
      let fav;
      let reviewed;
      if (isFav.rowCount === 0) {
        fav = false;
      } else {
        fav = true;
      }
      if (isReviewed.rowCount === 0) {
        reviewed = false;
      } else {
        reviewed = true;
      }
      client.release();
      return {
        success: true,
        ingredients: ingredients.rows,
        instructions: instructions.rows,
        isFav: fav,
        reviews: reviews.rows,
        isReviewed: reviewed,
      };
    } catch (err) {
      return errorMessage;
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
      errorMessage;
    }
  }

  static async allRecipes(category) {
    try {
      const client = await pool.connect();
      const results = await client.query(
        "SELECT * FROM recipes WHERE category = $1 AND publishable = TRUE",
        [category]
      );
      client.release();
      const recipes = results.rows;
      return { success: true, recipes: recipes };
    } catch (err) {
      return errorMessage;
    }
  }

  async save() {
    try {
      const client = await pool.connect();
      const newImageName = uuid();
      if (this.image !== null) {
        fs.writeFile(
          `${__dirname}/../images/${newImageName}.jpeg`,
          this.image,
          "base64",
          (err) => {
            if (err) return { error: "Couldn't save your image... try again?" };
          }
        );
      }
      const addRecipe = await client.query(
        "INSERT INTO recipes (user_id, title, image, cookTime, prepTime, category, publishable) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID;",
        [
          this.userId,
          this.title,
          this.image ? `${newImageName}.jpeg` : "",
          this.cookTime,
          this.prepTime,
          this.category,
          this.publishable,
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
      return errorMessage;
    }
  }
}

module.exports = Recipe;
