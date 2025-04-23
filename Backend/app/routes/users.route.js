const express = require("express");
const userRouter = express.Router();

const {
  getUsers,
  login,
  signup,
  deleteUser,
  updateUser,
} = require("../controllers/users.controller");

userRouter.get("/getUsers", getUsers);
userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.put("/delete", deleteUser);
userRouter.put("/update", updateUser);

module.exports = userRouter;
