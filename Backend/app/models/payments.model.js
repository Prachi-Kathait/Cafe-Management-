const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Payment = sequelize.define(
  "payments",
  {
    payment_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("Card", "Cash", "UPI"),
      allowNull: false,
    },
    payment_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    payment_status: {
      type: DataTypes.ENUM("paid", "unpaid", "failed"),
      defaultValue: "unpaid",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Payment;
