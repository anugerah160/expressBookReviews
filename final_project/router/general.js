const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required" });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop (ASYNC)
public_users.get('/', async (req, res) => {
  try {
    const bookList = await Promise.resolve(books); 
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN (ASYNC)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Promise.resolve(books[isbn]); 

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});

// Get book details based on author (ASYNC)
public_users.get('/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const filteredBooks = await Promise.resolve(
      Object.values(books).filter(book => book.author === author)
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get all books based on title (ASYNC)
public_users.get('/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const filteredBooks = await Promise.resolve(
      Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase())
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Get book review (ASYNC)
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Promise.resolve(books[isbn]); 

    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book reviews" });
  }
});

module.exports.general = public_users;
