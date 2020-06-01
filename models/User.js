const pool = require("../util/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  async save() {
    try {
      const client = await pool.connect();
      const checkUserExistance = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [this.username]
      );
      if (checkUserExistance.rowCount !== 0)
        return { error: "User already exists" };
      await client.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [this.username, this.password]
      );
      client.release();
      return { success: true, message: "User has been registered!" };
    } catch (err) {
      return {error: "Something went wrong... try again?"}
    }
  }

  static async login(username, password) {
    try {
      const client = await pool.connect();
      const findUser = await client.query(
        "SELECT id, username, password FROM users WHERE username = $1",
        [username]
      );
      if (findUser.rowCount !== 1) return { error: "No user found." };

      const hashedPassword = findUser.rows[0].password;
      const checkPasswordValidity = await bcrypt.compare(
        password,
        hashedPassword
      );

      if (!checkPasswordValidity) return { error: "Password incorrect." };
      const token = jwt.sign(
        { userId: findUser.rows[0].id },
        process.env.SECRET_KEY
      );
      return {
        success: true,
        message: "User has logged in.",
        username: findUser.rows[0].username,
        token: token,
        userId: findUser.rows[0].id,
      };
    } catch (err) {
      console.log(err);
      return {
        error: "Something went wrong... try again?",
      };
    }
  }
}

module.exports = User;
