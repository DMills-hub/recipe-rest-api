const pool = require("../util/db");
const bcrypt = require("bcryptjs");

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  async save() {
    const client = await pool.connect();
    await client.query(
      "INSERT INTO users (id, username, password) VALUES ($1, $2, $3)",
      [this.id, this.username, this.password]
    );
    client.release();
  }

  static async login(username, password) {
    try {
      const client = await pool.connect();
      const findUser = await client.query(
        "SELECT username, password FROM users WHERE username = $1",
        [username]
      );
      if (!findUser.rowCount === 1) return { error: "No user found." };

      const hashedPassword = findUser.rows[0].password;
      const checkPasswordValidity = await bcrypt.compare(
        password,
        hashedPassword
      );

      if (!checkPasswordValidity) return { error: "Password incorrect." };

      return {
        success: true,
        message: "User has logged in.",
      };
    } catch (err) {
      return {
        error: "Something went wrong... try again?",
      };
    }
  }
}

module.exports = User;
