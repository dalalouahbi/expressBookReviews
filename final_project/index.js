const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// JWT + SESSION AUTH MIDDLEWARE
app.use("/customer/auth/*", function (req, res, next) {
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    let token = req.session.authorization.accessToken;

    jwt.verify(token, "fingerprint_customer", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on port 5000"));