const errorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  //spread operator take all properties of err and put in error variable
  let error = { ...err };

  error.message = err.message;
  console.log(err.name);
  console.log(err.stack);

  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `User not found with id of ${err.value}`;
    error = new errorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
