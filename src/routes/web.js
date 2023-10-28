const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../middlewares/passport");


const Controllers = require("../controllers/homeControllers");

router.get("/", Controllers.getHomePage);
router.get("/signup", Controllers.getSignUp);
router.post("/signup", Controllers.postSignUp);

router.post("/login", Controllers.postLogin)

router.get("/dashboard", Controllers.parseCookie, passport.authenticate('jwt', { session: false }), Controllers.getDashBoard)
module.exports = { router };
