const express = require("express");
const router = express.Router();
const validation = require("./validation");
const User = require('../../src/db/models').User;
const userController = require("../controllers/userController");

router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show)
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUserSignIn, userController.signIn);
router.get("/users/upgrade", userController.upgradeForm);
router.post("/users/:id/upgrade", userController.upgrade);
router.get("/users/downgrade", userController.downgradeForm);
router.post("/users/:id/downgrade", userController.downgrade);


module.exports = router;