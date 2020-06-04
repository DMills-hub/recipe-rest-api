const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const recipesController = require("../controllers/recipesController");

router.post("/save", isAuth, recipesController.save);

router.get("/allRecipes/:category", isAuth, recipesController.getAllRecipes);

router.get("/myRecipes/:userId", isAuth, recipesController.getMyRecipes);

router.get("/singleRecipe/:recipeId/:userId", isAuth, recipesController.getSingleRecipe);

router.post("/addFavourite", isAuth, recipesController.addFavourite);

router.post("/deleteFavourite", isAuth, recipesController.deleteFavourite);

router.get("/myFavourites/:userId", isAuth, recipesController.getMyFavourites);

module.exports = router;
