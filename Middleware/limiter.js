const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 50, 
  message: {
    status: 429, 
    message: 'Too many requests from this IP, please try again after 1 minute.',
  },
  headers: true, 
  standardHeaders: true,
  legacyHeaders: false, 
});
const contactLimiter = rateLimit({
  windowMs: 60*1000, 
  max: 1, 
  message: {
    status: 429, 
    message: 'Too many requests from this IP, please try again after 1 minute.',
  },
  headers: true, 
  standardHeaders: true,
  legacyHeaders: false, 
});

module.exports = {limiter,contactLimiter};
