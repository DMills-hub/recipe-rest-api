const pool = require("../util/db");
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
    if (findUser.rowCount === 1) {
      return {
        success: true,
        message: "User has logged in.",
      };
    }
    return {
      error: "User credentials incorrect",
    };
  }
}

module.exports = User;
