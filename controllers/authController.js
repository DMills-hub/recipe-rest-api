const pool = require("../util/db");
const bcrypt = require("bcryptjs");
const SALT = 12;
const User = require("../models/User");

exports.register = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.json({ error: "Password's don't match." });
  
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = new User(null, username, email, hashedPassword);
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
    res.json({ error: "Something went wrong... try again?" });
  }
};
