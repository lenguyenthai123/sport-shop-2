const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../middlewares/passportAccessToken");


const Controllers = require("../controllers/homeControllers");

router.get("/", Controllers.getHomePage);

router.get("/dashboard", passport.authenticate('jwt', { session: false }), Controllers.getDashBoard)
module.exports = { router };
