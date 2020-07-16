const bcrypt = require("bcryptjs");
const SALT = 12;
const User = require("../models/User");
const errorMessage = require('../helpers/errorMessage');

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.json({ error: "Password's don't match." });

  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = new User(null, username, email, hashedPassword);
    const result = await user.save();
    res.json(result);
  } catch (err) {
    res.json(errorMessage);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const attemptLogin = await User.login(username, password);
    res.json(attemptLogin);
  } catch (err) {
    console.log(err);
    res.json(errorMessage);
  }
};

exports.getAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.getAccount(userId);
    res.json(user);
  } catch (err) {
    res.json(errorMessage)
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, SALT);
    const setNewPassword = await User.changePassword(userId, hashedPassword);
    res.json(setNewPassword);
  } catch (err) {
    res.json(errorMessage);
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const sendResetEmail = await User.resetPassword(email);
    res.json(sendResetEmail);
  } catch (err) {
    res.json(errorMessage);
  }
}
