const pool = require("../util/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("nodemailer");
const dotenv = require("dotenv");
const errorMessage = require("../helpers/errorMessage");
dotenv.config();

class User {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static async passwordReset(password, id) {
    try {
      const client = await pool.connect();
      await client.query("UPDATE users SET password = $1 WHERE id = $2", [password, id]);
      client.release();
      return {success: true, message: "Successfully changed your password."};
    } catch (err) {
      return errorMessage;
    }
  }

  static async resetPassword(emailAddress) {
    try {
      const client = await pool.connect();
      const email = await client.query("SELECT email, id FROM users WHERE email = $1", [emailAddress]);
      client.release();
      if (email.rowCount === 0) return { success: true, message: "No email found." };
      const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS, 
          pass: process.env.EMAIL_PASSWORD, 
        },
      });
      const token = jwt.sign(
        { userId: email.rows[0].id },
        process.env.SECRET_KEY
      );
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email.rows[0].email,
        subject: "Password Reset",
        html: `<p>Hi there, we've had a request to reset your password, please could you click the link below and reset your password. If you didn't request this please ignore it.</p><a href="${process.env.MAIN_URL}/auth/reset/${token}">Reset Password</a>`
      })
      return { success: true, message: "Email sent." };
    } catch (err) {
      return errorMessage;
    }
  }

  static async changePassword(userId, newPassword) {
    try {
      const client = await pool.connect();
      await client.query("UPDATE users SET password = $1 WHERE id = $2", [newPassword, userId]);
      client.release();
      return { success: true, message: "Password has now been updated." };
    } catch (err) {
      return errorMessage;
    }
  }

  static async getAccount(userId) {
    try {
      const client = await pool.connect();
      const user = await client.query(
        "SELECT username, email FROM users WHERE id = $1",
        [userId]
      );
      client.release();
      if (user.rowCount === 0)
        return { error: "Sorry we couldn't find your user info." };
      return { success: true, username: user.rows[0].username, email: user.rows[0].email };
    } catch (err) {
      return errorMessage;
    }
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
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        [this.username, this.email, this.password]
      );
      client.release();
      return { success: true, message: "User has been registered!" };
    } catch (err) {
      console.log(err);
      return { error: "Something went wrong... try again?" };
    }
  }

  static async login(username, password) {
    try {
      const client = await pool.connect();
      const findUser = await client.query(
        "SELECT id, username, password FROM users WHERE username = $1",
        [username]
      );
      client.release();
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
      return {
        error: "Something went wrong... try again?",
      };
    }
  }
}

module.exports = User;
