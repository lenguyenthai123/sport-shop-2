const express = require("express")
const router = express.Router();

const Controllers = require("../controllers/homeControllers");

router.get("/", Controllers.getHomePage);
router.post("/login", Controllers.postLogin)
module.exports = { router };
