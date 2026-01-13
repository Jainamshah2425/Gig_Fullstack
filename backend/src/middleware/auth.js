const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

exports.protect = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Not authenticated. Please login.' 
      });
    }
    
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user by ID (exclude password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found. Please login again.' 
      });
    }
    
    // 4. Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid token. Please login again.' 
    });
  }
};
