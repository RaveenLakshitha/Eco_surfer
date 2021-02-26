const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");

//@desc         Get all users
//@route        Get /api/v1/users
//@access       public

exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({ success: true, count: user.length, data: user });
  } catch (err) {
    next(err);
  }
};
//@desc         Get single user
//@route        Get /api/v1/users/:id
//@access       public

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new errorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    //res.status(400).json({ success: false });
    //next(new errorRespnse(`User not found with id of ${req.params.id}`, 404));
    next(err);
  }
};
//@desc         Create new user
//@route        Post /api/v1/users
//@access       private

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
//@desc         Update a user
//@route        PUT /api/v1/users
//@access       private

exports.updateUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};
//@desc         Delete a user
//@route        Delete /api/v1/users
//@access       private

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(
        new errorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
