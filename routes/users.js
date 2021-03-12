const express = require("express");
const {
  getUsers,
  getLogedUser,
  getUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

//Include other resource routers
//const postsRouter = require("./posts");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//Reroutes into other resourse routers
//router.use("/:userId/EcoPosts", postsRouter);

router.get("/getUsers", authorize("admin"), getUsers);
router.get("/getLogedUser", getLogedUser);
router.post("/createUser", createUser);
router.post("/loginUser", loginUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);
module.exports = router;
