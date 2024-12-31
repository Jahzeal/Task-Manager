const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { User, Task } = require('../models/Tasks');

router.get('../index.html', (req, res) => {
  res.send('This is the task manager page');
});





// Register Route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Please provide username and password" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists!" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    

    // Generate a token for the new user (optional)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1m" });

    
    res.status(201).json({
      msg: "User registered successfully",
      token, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error registering user" });
  }
});






    








router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Please provide username and password" });
    }

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    res.status(200).json({ msg: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error logging in user" });
  }
});

module.exports = router;

