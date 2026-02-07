const rateLimit = require("express-rate-limit") ;

const rateLimiter = (windowMs = 2 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs: windowMs, // 2 minutes
    max: max, // Max 100 requests per IP per 2 mins
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable old headers
  });
};

module.exports = rateLimiter ;
