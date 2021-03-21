const express = require("express");
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  postPhotoUpload
} = require("../controllers/posts");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

//router.route('/:id/photo').put(protect, authorize('User','Admin') userPhotoUpload);

router.get("/getPosts", protect, getPosts);
router.post("/create", protect, createPost);

//.get(getUser)
router.put("/updatePost/:id", protect, updatePost);
router.delete("/deletePost/:id", protect, deletePost);
router.put("/postPhotoUpload/:id", protect, postPhotoUpload);

module.exports = router;
