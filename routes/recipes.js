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

router.post("/deleteRecipe", isAuth, recipesController.deleteRecipe);

router.post("/updateImage", isAuth, recipesController.updateImage);

router.post("/addReview", isAuth, recipesController.addReview);

router.get("/reviews/:recipeId", isAuth, recipesController.getReviews);

module.exports = router;
