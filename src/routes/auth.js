const express = require("express")
const routerAuth = express.Router();

const passport = require("passport");
require("../middlewares/passportAccessToken");


const Authentication = require("../controllers/auth");


routerAuth.get("/signup", Authentication.getSignUp);
routerAuth.post("/signup", Authentication.postSignUp);

routerAuth.post("/login", Authentication.postLogin);
routerAuth.get("/login", Authentication.getLogin);

routerAuth.get("/logout", passport.authenticate('jwt', { session: false }), Authentication.getLogout);

routerAuth.get("/forgot-password", Authentication.getForgotPassword)
routerAuth.post("/forgot-password", Authentication.postForgotPassword)

routerAuth.get("/reset-password", Authentication.getResetPassword)
routerAuth.post("/reset-password", Authentication.postResetPassword)

routerAuth.get("/update-password", passport.authenticate('jwt', { session: false }), Authentication.getUpdatePassword)
routerAuth.post("/update-password", passport.authenticate('jwt', { session: false }), Authentication.postUpdatePassword)

module.exports = routerAuth;