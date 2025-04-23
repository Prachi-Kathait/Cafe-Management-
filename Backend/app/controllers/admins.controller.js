// app/controllers/admins.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const config = process.env;
const Admin = require("../models/admins.model");

// GET ALL ADMINS _______________________________________________________________
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

// LOGIN _______________________________________________________________________
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const payload = {
      adminId: admin.dataValues.admin_id,
      name: admin.dataValues.name,
      email: admin.dataValues.email,
    };

    const token = jwt.sign(payload, config.SECRET_KEY);

    res.status(200).json({
      message: "Admin logged in successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

// SIGNUP ______________________________________________________________________
const signup = async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;

    if (!name || !email || !phone_number || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      created_at: new Date(),
    });

    res.status(200).json({
      message: "Admin signed up successfully",
      data: newAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

// DELETE ADMIN (SOFT DELETE) _________________________________________________
const deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.body;

    if (!admin_id) {
      return res.status(400).json({ error: "Missing admin_id" });
    }

    const admin = await Admin.findOne({ where: { admin_id } });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    admin.is_deleted = true;
    admin.is_active = false;
    await admin.save();

    res
      .status(200)
      .json({ message: "Admin deleted (soft delete) successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
};

// UPDATE ADMIN _______________________________________________________________
const updateAdmin = async (req, res) => {
  try {
    const { admin_id, name, email, phone_number, password } = req.body;

    if (!admin_id) {
      return res.status(400).json({ error: "Missing admin_id" });
    }

    const admin = await Admin.findOne({ where: { admin_id } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    admin.name = name !== undefined ? name : admin.name;
    admin.email = email !== undefined ? email : admin.email;
    admin.phone_number =
      phone_number !== undefined ? phone_number : admin.phone_number;
    admin.password = password !== undefined ? password : admin.password;

    await admin.save();

    res.status(200).json({
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update admin" });
  }
};

module.exports = {
  getAdmins,
  login,
  signup,
  deleteAdmin,
  updateAdmin,
};
