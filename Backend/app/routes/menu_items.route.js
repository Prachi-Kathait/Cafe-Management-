const express = require("express");
const menuItemRouter = express.Router();

const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/menu_items.controller");

menuItemRouter.get("/getAll", getAllMenuItems);
menuItemRouter.get("/:id", getMenuItemById);
menuItemRouter.post("/create", createMenuItem);
menuItemRouter.put("/update", updateMenuItem);
menuItemRouter.put("/delete", deleteMenuItem);
menuItemRouter.patch("/toggle", toggleAvailability);

module.exports = menuItemRouter;
