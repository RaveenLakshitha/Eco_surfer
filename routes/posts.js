const express = require("express");
const { getPosts, createPost } = require("../controllers/posts");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

//router.route('/:id/photo').put(protect, authorize('User','Admin') userPhotoUpload);

router
  .route("/")
  .get(protect, getPosts)
  .post(protect, createPost);

/*   router
  .route("/:id")
  .get(getUser)
  .put(protect, authorize("User", "Admin"),updateUser)
  .delete(protect, authorize("User", "Admin"),deleteUser); */

module.exports = router;
