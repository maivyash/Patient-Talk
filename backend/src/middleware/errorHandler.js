function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};

