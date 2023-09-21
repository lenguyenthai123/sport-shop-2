const express = require("express")
const { getHomeText, getHomePic } = require("../controllers/homeControllers.js")
const router = express.Router()

router.get('/', getHomeText)

router.get("/abc", getHomePic)

module.exports = router;