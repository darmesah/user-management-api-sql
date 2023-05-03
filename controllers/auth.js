const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      const error = new Error("User Already Exists");
      error.statusCode = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ name, email, password: hashedPassword });

    res.status(200).json({
      message: "User created sucessfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      const error = new Error("User does not exist");
      error.statusCode = 404;
      throw error;
    }

    const isPassword = await bcrypt.compare(password, existingUser.password);

    if (!isPassword) {
      const error = new Error("Incorrect Login Information");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1 day",
      }
    );

    res.status(200).json({ token, userId: existingUser.id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
