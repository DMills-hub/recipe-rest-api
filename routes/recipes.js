const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const recipesController = require("../controllers/recipesController");

router.post("/save", isAuth, recipesController.save);

router.get("/allRecipes", isAuth, recipesController.getAllRecipes);

router.get("/myRecipes/:userId", isAuth, recipesController.getMyRecipes);

router.get("/singleRecipe/:recipeId", isAuth, recipesController.getSingleRecipe);

module.exports = router;
