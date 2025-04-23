// app/routes/admins.route.js
const express = require("express");
const adminRouter = express.Router();

const {
  getAdmins,
  login,
  signup,
  deleteAdmin,
  updateAdmin,
} = require("../controllers/admins.controller");
const verifyToken = require("../middleware/auth.middleware");

adminRouter.get("/getAdmins", verifyToken, getAdmins); // Route to get all admins
adminRouter.post("/login", login); // Route for admin login
adminRouter.post("/signup", signup); // Route for admin signup
adminRouter.put("/delete", deleteAdmin); // Route to soft delete admin
adminRouter.put("/update", updateAdmin); // Route to update admin details

module.exports = adminRouter;
