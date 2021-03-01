const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

//Include other resource routers
const postsRouter = require("./posts");

const router = express.Router();

//Reroutes into other resourse routers
router.use("/:userId/EcoPosts", postsRouter);

router
  .route("/")
  .get(getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);
module.exports = router;
