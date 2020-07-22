const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const recipesRouter = require("./routes/recipes");
dotenv.config();

app.set("view engine", "pug")
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, "views")));
app.use(cors());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use("/auth", authRouter);
app.use("/recipes", recipesRouter);

app.listen(PORT, "192.168.0.51");
