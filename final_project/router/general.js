const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!username || !password){
    return res.status(404).json({message: "Username and Password are required"});
  }

  const userExists = users.find(user => user.username === username);
  if(userExists){
    return res.status(400).json({message: "User already Exists"})
  }
  users.push({username, password});

  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  book = books[isbn];

  if(book){
    return res.status(200).json(book);
  }else{
    return res.status(404).json({message:"Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const {author} = req.params;
  const filteredBooks = Object.values(books).filter(book => books.author === author);

  if(filteredBooks.length > 0){
    return res.status(200).json(filteredBooks);
  }else{
    return req.status(404).json({message:"No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const {title} = req.params;
  const filteredBooks = Object.values(books).filter(book => books.title.toLowerCase() === title.toLowerCase());

  if(filteredBooks.length > 0){
    return res.status(200).json(filteredBooks);
  }else{
    return res.status(404).json({message:"No books found for this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  const book = book[isbn];

  if(book && book.reviews){
    return res.status(200).json(book.reviews);
  }else{
    return res.status(404).json({message:"No reviews found for this book"});
  }

});

module.exports.general = public_users;
