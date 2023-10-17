const express = require("express")
const router = express.Router()
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUSers, getUser, updateUserRole, deleteUser } = require("../controllers/userController")
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").post(logout) 
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/me/update").put(isAuthenticatedUser, updateProfile)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles('admin'), getAllUSers)
router.route("/admin/user/:id")
      .get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
      .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
      .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

module.exports = router