const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const path = require("path");

//@desc         Get all users
//@route        Get /api/v1/auth/getUsers
//@access       private/admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().populate("posts");
  res.status(200).json({ success: true, count: users.length, data: users });
});

//@desc         Get single user
//@route        Get /api/v1/auth/getUser/:id
//@access       private/admin

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc         Crate a user
//@route        Post /api/v1/auth/createuser
//@access       public

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc         Update user details
//@route        Put /api/v1/updateDetails
//@access       private/admin

exports.updateDetails = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  user = await User.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});

//@desc         Delete user details
//@route        Delete /api/v1/updateDetails
//@access       private

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

exports.profilepicUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

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

    await User.findByIdAndUpdate(req.params.id, { profile_pic: file.name });

    res.status(200).json({ success: true, data: file.name });
  });

  console.log(file.name);
});
