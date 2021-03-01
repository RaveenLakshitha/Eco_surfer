const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const Post = require("../models/Posts");

//@desc         Get all posts
//@route        Get /api/v1/posts
//@route        Get /api/v1/users/:userId/posts
//@access       public

exports.getPosts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.userId) {
    query = Post.find({ user: req.params.userId });
  } else {
    query = Post.find().populate("user");
  }

  const posts = await query;
  res.status(200).json({ success: true, count: posts.length, data: posts });
});
