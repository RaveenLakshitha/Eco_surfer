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
router.put("/:id/updatePost", protect, updatePost);
router.delete("/:id/deletePost", protect, deletePost);
router.put("/:id/postPhotoUpload", protect, postPhotoUpload);

module.exports = router;
