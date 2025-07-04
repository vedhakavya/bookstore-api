const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const USERS_FILE = "./data/users.json";

exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ error: "JWT token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Server Error: " + error.message });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const usersData = await fs.readFile(USERS_FILE, "utf8");
  const users = JSON.parse(usersData);

  const user = users.find((u) => u.email === email);
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
};
