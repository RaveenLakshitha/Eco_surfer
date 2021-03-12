const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");

//Protect Routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  /* 
    else if(req.cookies.token){
        token = req.cookies.token
    } */

  if (!token) {
    return next(new errorResponse("Not authorize to access this route", 401));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new errorResponse("Not authorize to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    req.user = await User.findOne();
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(
          `User role ${req.user.role} is not this authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
