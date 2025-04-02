const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "fingerprint_customer";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return username && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!username && !password){
    return res.status(400).json({message: "Username and Password are required"})
  }
  if(!authenticatedUser(username, password)){
    return res.status(401).json({message: "Invalid username or password"})
  }

  const token = jwt.sign({username}, SECRET_KEY, {expiresIn: "2h"})
  req.session.token = token;

  return res.status(200).json({message: "Login successful", token});
});

const verifyToken = (req, res, next) => {
    const token = req.session.token || req.headers["authorization"];

    if(!token){
        return res.status(403).json({message: "Access denied, No token."})
    }

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({message: "Invalid token"});
        }
        req.user = decoded;
        next()
    })
}

// Add a book review
regd_users.put("/auth/review/:isbn", verifyToken,(req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const {review} = req.body;
  const username = req.user.username;

  if(!books[isbn]){
    return res.status(404).json({message: "User not found"});
  }
  if(!review){
    return res.status(400).json({message: "Review content is required"})
  }

  if(!books[isbn].review){
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added/updated successfully ", reviews: books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
