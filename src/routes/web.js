const express = require("express")
const { getHomeText, getHomePic, postCreateUser, getCreateForm } = require("../controllers/homeControllers.js")
const router = express.Router()

router.get('/', getHomeText)
router.get("/abc", getHomePic)
router.get("/create", getCreateForm);

router.post("/create-user", postCreateUser)

module.exports = router;