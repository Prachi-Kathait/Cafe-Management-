const express = require("express");
const cafeRouter = express.Router();

const {
  getAllCafes,
  createCafe,
  updateCafe,
  deleteCafe,
} = require("../controllers/cafes.controller");

cafeRouter.get("/getAll", getAllCafes);
cafeRouter.post("/create", createCafe);
cafeRouter.put("/update", updateCafe);
cafeRouter.put("/delete", deleteCafe);

module.exports = cafeRouter;
