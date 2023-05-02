const Sequelize = require("sequelize");

const sequelize = new Sequelize("user-management", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
