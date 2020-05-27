const pool = require("../util/db");
const bcrypt = require("bcryptjs");
const SALT = 12;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.json({ error: "Password's don't match." });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    const client = await pool.connect();
    const checkUserExistance = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (checkUserExistance.rowCount !== 0) {
      return res.json({ error: "User already exists" });
    }
    const id = await client.query("SELECT * FROM users;");
    client.release();
    const user = new User(id.rows.length + 1, username, hashedPassword);
    user.save();
    res.json({ success: true, message: "User has been registered!" });
  } catch (err) {
    res.json({ error: "Something went wrong... try again?" });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const comparePassword = await bcrypt.compare(password, SALT);
    const attemptLogin = await User.login(username, comparePassword);
    res.json(attemptLogin);
  } catch (err) {
    res.json({ error: "Something went wrong... try again?" });
  }
};
