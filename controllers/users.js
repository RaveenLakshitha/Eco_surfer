const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//@desc         Get all users
//@route        Get /api/v1/users
//@access       public

exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({ success: true, count: user.length, data: user });
});

//@desc         Get single user
//@route        Get /api/v1/users/:id
//@access       public

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new errorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: user });
});
//@desc         Create new user
//@route        Post /api/v1/users
//@access       public

exports.createUser = asyncHandler(async (req, res, next) => {
  //req.body.post = req.post.id;

  const {
    name,
    slug,
    bio,
    phone,
    role,
    email,
    password,
    profile_pic,
    gender,
    address
  } = req.body;
  const user = await User.create(
    name,
    slug,
    bio,
    phone,
    role,
    email,
    password,
    profile_pic,
    gender,
    address
  );

  res.status(200).json({ success: true });
  //sendTokenResponse(user, 200, res);
});

//@desc         Login user
//@route        Post /api/v1/users
//@access       public

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    return next(new errorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorResponse("Invalid Credentials", 401));
  }

  //Check if pwd matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new errorResponse("Invalid Credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

//Get token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJWTtoken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
//@desc         Update a user
//@route        PUT /api/v1/users
//@access       private

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new errorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: user });
});
//@desc         Delete a user
//@route        Delete /api/v1/users
//@access       private

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new errorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  //user.remove();
  res.status(200).json({ success: true, data: {} });
});

//@desc         Get Current Login user
//@route        Post /api/v1/users
//@access       private

exports.getLogedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});
