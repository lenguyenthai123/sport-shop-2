const express = require("express")
const router = express.Router();

const Controllers = require("../controllers/homeControllers");

router.get("/", Controllers.getHomePage);
router.get("/signup", Controllers.getSignUp);
router.post("/signup", Controllers.postSignUp);

router.post("/login", Controllers.postLogin)
module.exports = { router };
