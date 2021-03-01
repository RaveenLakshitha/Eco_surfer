const errorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  //spread operator take all properties of err and put in error variable
  let error = { ...err };

  error.message = err.message;
  console.log(err.name);
  console.log(err);

  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `User not found with id of ${err.value}`;
    error = new errorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new errorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    error = new errorResponse(message, 400);
  }

  //Mongoose
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
