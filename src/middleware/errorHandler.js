const config = require('../config/env');

const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (req.xhr || req.path.startsWith('/api/')) {
    return res.status(err.statusCode || 500).json({
      error: config.isProduction ? 'Internal server error' : err.message,
    });
  }

  res.status(err.statusCode || 500).render('error', {
    message: config.isProduction ? 'Something went wrong' : err.message,
    error: config.isProduction ? null : err,
    user: req.user || null,
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    error: null,
    user: req.user || null,
  });
};

module.exports = { errorHandler, notFoundHandler };
