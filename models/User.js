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
}

module.exports = User;
