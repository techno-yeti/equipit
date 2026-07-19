const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

const extractUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.redirect('/login');
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect('/login');
    }

    if (!roles.includes(req.user.role)) {
      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return res.status(403).render('error', {
        message: 'You do not have permission to access this page',
        error: null,
        user: req.user,
      });
    }
    next();
  };
};

module.exports = { extractUser, requireAuth, requireRole };
