/**
 * Custom Error classes and Express Error Handling Middleware.
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';
  
  // Clean security check: Ensure API key is never leaked in log or response
  const sanitizedMessage = message.replace(/AIzaSy[A-Za-z0-9_-]{33}/g, '[REDACTED_API_KEY]');

  console.error(`[Error Handler] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Error: ${sanitizedMessage}`);

  res.status(statusCode).json({
    success: false,
    error: sanitizedMessage,
    ...(err.details ? { details: err.details } : {})
  });
};
