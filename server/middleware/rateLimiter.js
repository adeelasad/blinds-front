import rateLimit from 'express-rate-limit';

// Strict rate limiter for authentication endpoints: max 5 login/auth attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General rate limiter for public submissions (leads, quotes, bookings)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: {
    success: false,
    error: 'Too many requests submitted. Please wait a few minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
