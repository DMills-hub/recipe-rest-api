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
    const client = pool.connect();
    const findUser = await client.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (!findUser.rowCount === 1) {
      return {
        error: "No user found.",
      };
    }
    const hashedPassword = findUser.rows[0].password;
    const checkPasswordValidity = await bcrypt.compare(
      password,
      hashedPassword
    );
    if (!checkPasswordValidity) {
      return {
        error: "Password incorrect.",
      };
    }
    return {
      success: true,
      message: "User has logged in.",
    };
  }
}

module.exports = User;
