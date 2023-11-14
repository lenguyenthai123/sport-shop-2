const express = require("express")
const router = express.Router();
const controllers = require("../controllers/user");

router.get('/profile', controllers.getAccountDetail)

module.exports = router;