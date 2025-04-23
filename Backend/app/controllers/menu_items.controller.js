const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const config = process.env;
const MenuItem = require("../models/menu_items.model");

// 1. GET all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll({ where: { is_deleted: false } });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// 2. GET single menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findOne({ where: { item_id: id } });
    if (!item || item.is_deleted)
      return res.status(404).json({ error: "Item not found" });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
};

// 3. CREATE a new menu item
const createMenuItem = async (req, res) => {
  try {
    const { cafe_id, item_name, description, price, category, is_available } =
      req.body;

    if (!cafe_id || !item_name || !price || !category) {
      return res.status(400).json({
        error: "cafe_id, item_name, price, and category are required",
      });
    }

    const newItem = await MenuItem.create({
      cafe_id,
      item_name,
      description,
      price,
      category,
      is_available: is_available !== undefined ? is_available : true,
      created_at: new Date(),
    });

    res.status(201).json({
      message: "Menu item created successfully",
      data: newItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
};

// 4. UPDATE menu item
const updateMenuItem = async (req, res) => {
  try {
    const { item_id, item_name, description, price, category, is_available } =
      req.body;

    if (!item_id) {
      return res.status(400).json({ error: "item_id is required" });
    }

    const item = await MenuItem.findOne({ where: { item_id } });
    if (!item || item.is_deleted) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    item.item_name = item_name !== undefined ? item_name : item.item_name;
    item.description =
      description !== undefined ? description : item.description;
    item.price = price !== undefined ? price : item.price;
    item.category = category !== undefined ? category : item.category;
    item.is_available =
      is_available !== undefined ? is_available : item.is_available;
    item.updated_at = new Date();

    await item.save();

    res.status(200).json({
      message: "Menu item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
};

// 5. SOFT DELETE a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { item_id } = req.body;

    if (!item_id) {
      return res.status(400).json({ error: "item_id is required" });
    }

    const item = await MenuItem.findOne({ where: { item_id } });
    if (!item || item.is_deleted) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    item.is_deleted = true;
    item.is_active = false;
    await item.save();

    res.status(200).json({ message: "Menu item deleted (soft delete)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};

// 6. TOGGLE availability
const toggleAvailability = async (req, res) => {
  try {
    const { item_id } = req.body;

    if (!item_id) {
      return res.status(400).json({ error: "item_id is required" });
    }

    const item = await MenuItem.findOne({ where: { item_id } });
    if (!item || item.is_deleted) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    item.is_available = !item.is_available;
    await item.save();

    res.status(200).json({
      message: `Menu item is now ${
        item.is_available ? "available" : "unavailable"
      }`,
      data: item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to toggle availability" });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
