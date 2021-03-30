const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const Post = require("../models/Posts");
const React = require("../models/Reaction");

//@desc         Get all Reacts
//@route        Get /api/v1/reacts
//@route        Get /api/v1/users/:userId/posts
//@access       private

exports.getReviews = asyncHandler(async (req, res, next) => {
  const reacts = await React.find(req.body).populate();
  res.status(200).json({ success: true, count: reacts.length, data: reacts });
});

//@desc         Get single user Reacts
//@route        Get /api/v1/reacts
//@route        Get /api/v1/users/:userId/posts
//@access       private

exports.getReview = asyncHandler(async (req, res, next) => {
  req.body.post = req.params.id;
  req.body.user = req.user.id;
  console.log(req.body);

  const reacts = await React.find(req.body).populate("post");
  res.status(200).json({ success: true, data: reacts });
});

//@desc         Add a react
//@route        POst /api/v1/posts
//@route        Get /api/v1/users/:userId/posts
//@access       public

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.post = req.params.id;
  req.body.user = req.user.id;

  const react = await React.create(req.body);

  res.status(200).json({ success: true, data: react });
});

//@desc         Update a react
//@route        Put /api/v1/posts
//@route        Put /api/v1/users/posts/:userId
//@access       private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let react = await React.findById(req.params.id);

  if (!react) {
    return next(
      new errorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  react = await React.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  await react.save();

  res.status(200).json({ success: true, data: react });
});

//@desc         Delete a react
//@route        Delete /api/v1/posts
//@route        Delete /api/v1/users/posts/:userId
//@access       private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const react = await React.findById(req.params.id);

  if (!react) {
    return next(
      new errorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  await react.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
