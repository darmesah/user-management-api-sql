const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const sequelize = require("./util/database");
const User = require("./models/auth");
const Note = require("./models/note");

const app = express();
app.use(bodyParser.json());

const authRoutes = require("./routes/auth");

app.use("/api", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

Note.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Note);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(8080, () => {
      console.log("started on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
