const pool = require("../util/db");
const dotenv = require("dotenv");
dotenv.config();
const format = require("pg-format");
const { uuid } = require("uuidv4");
const { errorMessage } = require("../helpers/errorMessage");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const BUCKET_NAME = process.env.BUCKET_NAME;

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
    serves,
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
    this.serves = serves;
    this.category = category;
    this.publishable = publishable;
  }

  static async updateRecipe(title, image, ingredients, instructions, cookTime, prepTime, serves, category, id) {
    try {
      const client = await pool.connect();
      const imageId = uuid();
      const oldImage = await client.query(
        "SELECT image FROM recipes WHERE id = $1",
        [id]
      );
      if (oldImage.rows[0].image !== "" && image !== "") {
        const deleteParams = {
          Bucket: BUCKET_NAME,
          Key: oldImage.rows[0].image,
        };
        s3.deleteObject(deleteParams, (err) => {
          if (err) return { error: "Couldn't delete image." };
        });
        await client.query("UPDATE recipes SET image = $1 WHERE id = $2", [
          `${imageId}.jpeg`,
          id,
        ]);
        const fileContent = new Buffer(image, "base64");
        const params = {
          Bucket: BUCKET_NAME,
          Key: `${imageId}.jpeg`,
          Body: fileContent,
          ContentEncoding: "base64",
          ContentType: "image/jpeg",
        };
        s3.upload(params, (err) => {
          if (err) {
            return err;
          }
        });
      }
      await client.query("UPDATE recipes SET title = $1, cooktime = $2, preptime = $3, serving = $4, category = $5 WHERE id = $6", [title, cookTime, prepTime, serves, category, id]);
      await client.query("DELETE FROM ingredients WHERE recipe_id = $1", [id]);
      await client.query("DELETE FROM instructions WHERE recipe_id = $1", [id]);
      const newIngredients = ingredients.map((_, index) => {
        return [id, ingredients[index].ingredient];
      });
      const newInstructions = instructions.map((_, index) => {
        return [id, instructions[index].instruction];
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
      return { success: true, message: "Recipe successfully updated." }
    } catch (err) {
      console.log(err);
      return errorMessage;
    }
  }

  static async searchMyRecipes(userId, title) {
    try {
      const client = await pool.connect();
      const searchMyRecipes = await client.query(`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER('%${title}%') AND user_id = $1`, [userId]);
      client.release();
      return { success: true, myRecipes: searchMyRecipes.rows }
    } catch (err) {
      return errorMessage;
    }
  }

  static async searchedRecipes(category, title) {
    try {
      const client = await pool.connect();
      const searchedRecipes = await client.query(`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER('%${title}%') AND category = $1 AND publishable = TRUE`, [category]);
      client.release();
      return { success: true, recipes: searchedRecipes.rows };
    } catch (err) {
      return errorMessage;
    }
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
      return errorMessage;
    }
  }

  static async updateImage(recipeId, base64) {
    try {
      const client = await pool.connect();
      const id = uuid();
      const oldImage = await client.query(
        "SELECT image FROM recipes WHERE id = $1",
        [recipeId]
      );
      if (oldImage.rows[0].image !== "") {
        const deleteParams = {
          Bucket: BUCKET_NAME,
          Key: oldImage.rows[0].image,
        };
        s3.deleteObject(deleteParams, (err) => {
          if (err) return { error: "Couldn't delete image." };
        });
      }
      await client.query("UPDATE recipes SET image = $1 WHERE id = $2", [
        `${id}.jpeg`,
        recipeId,
      ]);
      const fileContent = new Buffer(base64, "base64");
      const params = {
        Bucket: BUCKET_NAME,
        Key: `${id}.jpeg`,
        Body: fileContent,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      };
      s3.upload(params, (err) => {
        if (err) {
          return err;
        }
      });
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
      if (image.rows[0].image !== "") {
        const deleteParams = {
          Bucket: BUCKET_NAME,
          Key: image.rows[0].image,
        };
        s3.deleteObject(deleteParams, (err) => {
          if (err) return { error: "Couldn't delete image." };
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
        "SELECT recipes.id, recipes.user_id, recipes.title, recipes.image, recipes.cooktime, recipes.preptime, recipes.serving, recipes.category FROM favourites INNER JOIN recipes ON recipes.id = favourites.recipe_id WHERE favourites.user_id = $1 ORDER BY favourites.id;",
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
        "SELECT id, ingredient FROM ingredients WHERE recipe_id = $1 ORDER BY id",
        [recipeId]
      );
      const instructions = await client.query(
        "SELECT id, instruction FROM instructions WHERE recipe_id = $1 ORDER BY id",
        [recipeId]
      );
      if (ingredients.rowCount === 0 || instructions.rowCount === 0)
        return { error: "Couldn't find either ingredients or instructions." };
      const isFav = await client.query(
        "SELECT * FROM favourites WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId]
      );
      const reviews = await client.query(
        "SELECT * FROM reviews WHERE recipe_id = $1 ORDER BY id",
        [recipeId]
      );
      const isReviewed = await client.query(
        "SELECT * FROM reviews WHERE recipe_id = $1 AND user_id = $2",
        [recipeId, userId]
      );
      const category = await client.query("SELECT category FROM recipes WHERE id = $1", [recipeId]);
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
        category: category.rows[0].category
      };
    } catch (err) {
      return errorMessage;
    }
  }

  static async myRecipes(userId) {
    try {
      const client = await pool.connect();
      const recipes = await client.query(
        "SELECT * FROM recipes WHERE user_id = $1 ORDER BY id;",
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
        "SELECT * FROM recipes WHERE category = $1 AND publishable = TRUE ORDER BY id;",
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
        const fileContent = new Buffer(this.image, "base64");
        const params = {
          Bucket: BUCKET_NAME,
          Key: `${newImageName}.jpeg`,
          Body: fileContent,
          ContentEncoding: "base64",
          ContentType: "image/jpeg",
        };
        s3.upload(params, (err) => {
          if (err) return { error: "Sorry couldn't upload image." };
        });
      }
      const addRecipe = await client.query(
        "INSERT INTO recipes (user_id, title, image, cookTime, prepTime, serving, category, publishable) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ID;",
        [
          this.userId,
          this.title,
          this.image ? `${newImageName}.jpeg` : "",
          this.cookTime,
          this.prepTime,
          this.serves,
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
