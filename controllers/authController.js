const pool = require("../util/db");
const bcrypt = require("bcryptjs");
const SALT = 12;
const User = require("../models/User");

exports.register = async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.json({ error: "Password's don't match." });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = new User(null, username, hashedPassword);
    const result = await user.save();
    res.json(result);
  } catch (err) {
    res.json({ error: "Something went wrong... try again?" });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const attemptLogin = await User.login(username, password);
    res.json(attemptLogin);
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong... try again?" });
  }
};
