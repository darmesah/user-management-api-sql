const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      const error = new Error("Not authenticated. ");
      error.statusCode = 401;
      throw error;
    }

    const token = req.get("Authorization").split(" ")[1];

    let decodedToken;

    decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      const error = new Error("Not Authenticated");
      error.statusCode = 500;
      throw error;
    }

    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      const error = new Error("Not Authenticated");
      error.statusCode = 500;
      throw error;
    }

    req.user = user;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

  next();
};
