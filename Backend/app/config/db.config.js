// config/db.config.js
const { Sequelize } = require("sequelize");

const dbConfig = {
  database: "cafe_management_system",
  username: "root",
  password: "123456",
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: true,
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: { min: 0, max: 5, idle: 10000 },
    dialectOptions: {
      rejectUnauthorised: false,
    },
    logging: dbConfig.logging,
  }
);

module.exports = sequelize;
