function notFoundHandler(req, res, next) {
  if (res.headersSent) return next();
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
}


module.exports = {
  notFoundHandler,
  errorHandler,
};

