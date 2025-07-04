const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./middleware/logger");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

const app = express();
app.use(bodyParser.json());

// app.use(express.json());
app.use(logger);
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

// Add this for browser testing
app.get("/", (req, res) => {
  res.send("✅ Bookstore API is running!");
});


// 404 Handler
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
