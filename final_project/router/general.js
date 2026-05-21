const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// REGISTER USER
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username/password required" });
    }

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.json({ message: "User registered successfully" });
});

// GET ALL BOOKS
public_users.get('/', function (req, res) {
    return res.json(books);
});

// GET BY ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.json(books[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });
});

// GET BY AUTHOR
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = {};

    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result[key] = books[key];
        }
    }

    return res.json(result);
});

// GET BY TITLE
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};

    for (let key in books) {
        if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            result[key] = books[key];
        }
    }

    return res.json(result);
});

// GET REVIEWS
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.json(books[isbn].reviews);
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;