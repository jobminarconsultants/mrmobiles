const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv=require("dotenv")
dotenv.config()

const authController = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error'});
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.jwt_sectret_key, { expiresIn: '1h' });
      res.json({ token, message:"Login success"});
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  authenticateToken: (req, res, next) => {
    const token = req.header('authorization')
    // console.log(req.header('authorization'));
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token,process.env.jwt_sectret_key, (err, decoded) => {
      if (err) {
        return res.status(404).json({ error: 'Invalid token' });
      }
      req.userId = decoded.userId;
      next();
    });
  },
};

module.exports = authController;
