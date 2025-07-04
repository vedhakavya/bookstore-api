const express = require("express");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");

const authMiddleware = require("../middleware/auth");

const router = express.Router();
const BOOKS_FILE = "./data/books.json";

// All routes below require a valid JWT

// GET /books → List all books
router.get("/", authMiddleware.auth, async (req, res) => {
  try {
    const books = await fs.readJson(BOOKS_FILE).catch(() => []);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Error reading books file" });
  }
});

// GET /books/:id → Get book by ID
router.get("/:id", authMiddleware.auth, async (req, res) => {
  try {
    const books = await fs.readJson(BOOKS_FILE).catch(() => []);
    const book = books.find((b) => b.id === req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Error fetching book" });
  }
});

// POST /books → Add a new book
router.post("/", authMiddleware.auth, async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    if (!title || !author || !genre || !publishedYear) {
      return res.status(400).json({ error: "Missing book fields" });
    }

    const books = await fs.readJson(BOOKS_FILE).catch(() => []);
    const newBook = {
      id: uuidv4(),
      title,
      author,
      genre,
      publishedYear,
      userId: req.user.userId,
    };

    books.push(newBook);
    await fs.writeJson(BOOKS_FILE, books);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: "Error adding book" });
  }
});

// PUT /books/:id → Update a book by ID
router.put("/:id", authMiddleware.auth, async (req, res) => {
  try {
    const books = await fs.readJson(BOOKS_FILE).catch(() => []);
    const index = books.findIndex((b) => b.id === req.params.id);

    if (index === -1) return res.status(404).json({ error: "Book not found" });
    if (books[index].userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own books" });
    }

    books[index] = { ...books[index], ...req.body };
    await fs.writeJson(BOOKS_FILE, books);
    res.json(books[index]);
  } catch (err) {
    res.status(500).json({ error: "Error updating book" });
  }
});

// DELETE /books/:id → Delete a book by ID
router.delete("/:id", authMiddleware.auth, async (req, res) => {
  try {
    const books = await fs.readJson(BOOKS_FILE).catch(() => []);
    const index = books.findIndex((b) => b.id === req.params.id);

    if (index === -1) return res.status(404).json({ error: "Book not found" });
    if (books[index].userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own books" });
    }

    books.splice(index, 1);
    await fs.writeJson(BOOKS_FILE, books);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting book" });
  }
});

module.exports = router;
