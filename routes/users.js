const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateDetails,
  deleteUser,
  profilepicUpload
} = require("../controllers/users");

//const router = express.Router();
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router.get("/getUsers", protect, getUsers);
router.post("/createUser", protect, createUser);

router.get("/getUser/:id", protect, getUser);
router.put("/updateDetails/:id", protect, updateDetails);
router.delete("/deleteUser/:id", protect, deleteUser);
router.put("/profilepicUpload/:id", protect, profilepicUpload);

module.exports = router;
