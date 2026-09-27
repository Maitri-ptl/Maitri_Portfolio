// Centralized error handler — the last middleware mounted in server.js.
// Any controller that calls next(error) (instead of handling it inline)
// ends up here, so we only have one place that decides how errors look
// in the API response.
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
    // `details` holds field-level messages (e.g. from express-validator);
    // only included when a controller set it.
    ...(err.details && { details: err.details }),
  });
};

// Catches requests to routes that don't exist and hands them to errorHandler
// as a 404, instead of Express's default HTML error page.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
