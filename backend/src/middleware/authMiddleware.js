const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(`--- [AUTH AUDIT] Checking roles [${roles}] for User: ${req.user.name} (${req.user.systemRole}) ---`);
    if (!roles.includes(req.user.systemRole)) {
      console.warn(`--- [AUTH REJECTED] User role ${req.user.systemRole} is not in [${roles}] ---`);
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.systemRole} is not authorized to access this route`
      });
    }
    next();
  };
};
