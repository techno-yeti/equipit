const helmet = require('helmet');
const config = require('./env');

const isLocalhost = config.appBaseUrl.includes('localhost');

const securityHeaders = helmet({
  contentSecurityPolicy: isLocalhost
    ? false
    : {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'"],
        },
      },
  crossOriginResourcePolicy: isLocalhost ? false : { policy: 'same-origin' },
  crossOriginOpenerPolicy: isLocalhost ? false : { policy: 'same-origin' },
  hsts: config.isProduction && !isLocalhost
    ? { maxAge: 63072000, includeSubDomains: true }
    : false,
});

module.exports = { securityHeaders };
