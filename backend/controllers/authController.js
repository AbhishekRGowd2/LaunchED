const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hardcoded admin check for simplicity or DB check
    // In a real app, query "users" or "admins" table
    // For this assessment, let's assume we have an 'admins' table or just a hardcoded one in ENV ? 
    // Requirement says: "Admin login with password hashing (bcrypt)".
    // So we should probably have an admins table.
    
    const userResult = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({
        id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Auth login error:', error.message || error);
    res.status(500).json({
      message: 'Unable to sign in. Please try again later.',
    });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = { authUser };
