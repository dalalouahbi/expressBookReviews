const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// REGISTER USER (you are missing logic in general router, but keep users here)
const registerUser = (username, password) => {
    if (isValid(username)) return false;
    users.push({ username, password });
    return true;
};

// LOGIN
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid login" });
    }

    let accessToken = jwt.sign(
        { username },
        "fingerprint_customer",
        { expiresIn: "1h" }
    );

    req.session.authorization = {
        accessToken,
        username
    };

    return res.json({ token: accessToken });
});

// ADD / UPDATE REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.json({
        message: "Review added/updated",
        reviews: books[isbn].reviews
    });
});

// DELETE REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.json({ message: "Review deleted" });
    }

    return res.status(404).json({ message: "No review found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;