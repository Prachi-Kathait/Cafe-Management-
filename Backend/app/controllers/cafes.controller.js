const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const config = process.env;
const Cafe = require("../models/cafes.model");

// 1. GET all cafes
const getAllCafes = async (req, res) => {
  try {
    const cafes = await Cafe.findAll({
      where: { is_deleted: false },
    });
    res.status(200).json(cafes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cafes" });
  }
};

// 2. CREATE a new cafe
const createCafe = async (req, res) => {
  try {
    const { cafe_name, location, contact_number, description } = req.body;

    if (!cafe_name || !location) {
      return res
        .status(400)
        .json({ error: "cafe_name and location are required" });
    }

    const newCafe = await Cafe.create({
      cafe_name,
      location,
      contact_number,
      description,
      created_at: new Date(),
    });

    res.status(201).json({
      message: "Cafe created successfully",
      data: newCafe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create cafe" });
  }
};

// 3. UPDATE a cafe
const updateCafe = async (req, res) => {
  try {
    const { cafe_id, cafe_name, location, contact_number, description } =
      req.body;

    if (!cafe_id) {
      return res.status(400).json({ error: "cafe_id is required" });
    }

    const cafe = await Cafe.findOne({ where: { cafe_id } });
    if (!cafe || cafe.is_deleted) {
      return res.status(404).json({ error: "Cafe not found" });
    }

    cafe.cafe_name = cafe_name !== undefined ? cafe_name : cafe.cafe_name;
    cafe.location = location !== undefined ? location : cafe.location;
    cafe.contact_number =
      contact_number !== undefined ? contact_number : cafe.contact_number;
    cafe.description =
      description !== undefined ? description : cafe.description;
    cafe.updated_at = new Date();

    await cafe.save();

    res.status(200).json({
      message: "Cafe updated successfully",
      data: cafe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cafe" });
  }
};

// 4. SOFT DELETE a cafe
const deleteCafe = async (req, res) => {
  try {
    const { cafe_id } = req.body;

    if (!cafe_id) {
      return res.status(400).json({ error: "cafe_id is required" });
    }

    const cafe = await Cafe.findOne({ where: { cafe_id } });
    if (!cafe || cafe.is_deleted) {
      return res.status(404).json({ error: "Cafe not found" });
    }

    cafe.is_deleted = true;
    cafe.is_active = false;
    await cafe.save();

    res
      .status(200)
      .json({ message: "Cafe deleted successfully (soft delete)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete cafe" });
  }
};

module.exports = {
  getAllCafes,
  createCafe,
  updateCafe,
  deleteCafe,
};
