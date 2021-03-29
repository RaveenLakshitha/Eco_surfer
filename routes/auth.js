const express = require("express");
const {
  register,
  loginUser,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  deleteHimself,
  profilepicUpload
} = require("../controllers/auth");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/register", register);
router.delete("/deleteHimself", protect, deleteHimself);
router.post("/login", loginUser);
router.get("/logout", logout);
router.put("/updateDetails", protect, updateDetails);
router.put("/updatePassword", protect, updatePassword);
router.get("/me", protect, getMe);
router.put("/profilepicUpload", protect, profilepicUpload);

module.exports = router;
