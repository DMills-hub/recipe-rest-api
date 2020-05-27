const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.json({error: "You are not authorized to make this request"});
  }
  const verify = jwt.verify(token, process.env.SECRET_KEY);
  if (verify.userId) {
    return next();
  }
  res.json({error: "You are not authorized to make this request"});
}