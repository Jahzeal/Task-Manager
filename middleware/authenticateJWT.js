const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" }); // No token provided
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the decoded user info in the request object for later use
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired token" }); // Invalid or expired token
  }
};

// Serve static files (without protection)
app.use(express.static(path.join(__dirname, "public")));

// Route to protect index.html
// app.get('/index.html', authenticateJWT, (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.get("/homePage.html", authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homePage.html"));
});

module.exports = authenticateJWT;
