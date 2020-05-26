const pool = require("../util/db");
const bcrypt = require("bcryptjs");
const SALT = 12;

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
      return res.json({ error: "User already exists" })
    }
    const id = await client.query("SELECT * FROM users;");
    await client.query("INSERT INTO users (id, username, password) VALUES ($1, $2, $3)",[id.rows.length + 1, username, hashedPassword])
    client.release();
    res.json({success: true, message: "User has been registered!"});
  } catch (err) {
    res.json({error: "Something went wrong... try again?"});
  }
};
