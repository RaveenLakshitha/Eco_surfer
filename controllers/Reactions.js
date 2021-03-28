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

  const reacts = await React.find(req.body).populate();
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
