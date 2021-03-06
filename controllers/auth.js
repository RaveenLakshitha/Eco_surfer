const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const path = require("path");

//@desc         Create new user
//@route        Post /api/v1/auth/register
//@access       public

exports.register = asyncHandler(async (req, res, next) => {
  const {
    name,
    bio,
    phone,
    email,
    password,
    gender,
    address,
    role,
    leaderBoardPoints
  } = req.body;

  //Create user
  const user = await User.create({
    name,
    bio,
    phone,
    email,
    password,
    gender,
    address,
    role,
    leaderBoardPoints
  });

  sendTokenResponse(user, 200, res);

  /*   const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user
  }); */
});

//@desc         Login user
//@route        Post /api/v1/auth/login
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
  const token = user.getSignedJwtToken();
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

//@desc         Logout Current Login user and clear cookie
//@route        Get /api/v1/auth/logout
//@access       private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

//@desc         Get Current Login user
//@route        Get /api/v1/auth/me
//@access       private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("posts");

  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc         Update user details
//@route        Put /api/v1/updateDetails
//@access       private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    phone: req.body.phone,
    gender: req.body.gender,
    address: req.body.address
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc         Update password
//@route        Put /api/v1/auth/updatepassword
//@access       private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new errorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc         Delete the loged user
//@route        Delete /api/v1/auth/deleteHimself
//@access       private

exports.deleteHimself = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(
      new errorResponse(`User not found with id of ${req.user.id}`, 404)
    );
  }

  user.remove();

  res.status(200).json({ success: true, data: {} });
});

//@desc         Upload the profile pic
//@route        Put /api/v1/
//@access       private

exports.profilepicUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!req.files) {
    return next(new errorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new errorResponse(`Please upload an image file`, 400));
  }

  //Check file size

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new errorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom file Name
  file.name = `photo_${user._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new errorResponse(`Problem with file upload`, 500));
    }

    await User.findByIdAndUpdate(req.user.id, { profile_pic: file.name });

    res.status(200).json({ success: true, data: file.name });
  });

  // console.log(file.name);
  console.log(req.files);
});
