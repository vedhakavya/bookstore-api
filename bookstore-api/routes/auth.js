const express = require("express");
const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const USERS_FILE = "./data/users.json";

// Register Route
router.post("/register", async(req, res) => {
  const { email, password } = req.body;

  const usersData = await fs.readFile(USERS_FILE, "utf8");
  const users = JSON.parse(usersData);

  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ message: "User registered" });
});

// ✅ Test Route

router.post('/login',authMiddleware.login);
router.get("/test", (req, res) => {
  res.json({ message: "Auth test works" });
});

module.exports = router;
