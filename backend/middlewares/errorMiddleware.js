const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;