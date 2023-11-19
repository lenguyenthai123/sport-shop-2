const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passportAccessToken.js");

const Controllers = require("./userController.js");

router.get("/", Controllers.getHomePage);
router.get("/dashboard", passport.authenticate('jwt', { session: false }), Controllers.getDashBoard);

module.exports = router;
