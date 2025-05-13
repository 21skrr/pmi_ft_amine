module.exports = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
