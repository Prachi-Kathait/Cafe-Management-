const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const config = process.env;
const User = require("../models/users.model");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
// LOGIN_________________________________________________________________

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const payload = {
      userId: user.dataValues.user_id,
      name: user.dataValues.name,
      email: user.dataValues.email,
      phoneNumber: user.dataValues.phone_number,
    };

    const token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: 20000 });

    res.status(200).json({
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

// NEW USER __________________________________________________________________
const signup = async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;

    if (!name || !email || !phone_number || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      created_at: new Date(),
    });

    res.status(200).json({
      message: "User signed up successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.is_deleted = true;
    user.is_active = false;
    await user.save();

    res
      .status(200)
      .json({ message: "User deleted (soft delete) successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id, name, email, phone_number, password } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const user = await User.findOne({ where: { user_id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name !== undefined ? name : user.name;
    user.email = email !== undefined ? email : user.email;
    user.phone_number =
      phone_number !== undefined ? phone_number : user.phone_number;
    user.password = password !== undefined ? password : user.password;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

module.exports = {
  getUsers,
  login,
  signup,
  deleteUser,
  updateUser,
};
