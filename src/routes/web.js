const express = require("express")
const { getHomeText, getHomePic, postCreateUser, getCreateForm, getUpdate, postUpdated, postDelete, getSearch, postSearchItem } = require("../controllers/homeControllers.js")
const router = express.Router()

router.get('/', getHomeText)
router.get("/abc", getHomePic)
router.get("/create", getCreateForm);
router.get("/update/:userNumber", getUpdate)
router.get("/search", getSearch)

router.post("/delete/:userNumber", postDelete)
router.post("/update/:userNumber/updated", postUpdated)
router.post("/create-user", postCreateUser)
router.post("/search/item", postSearchItem)
module.exports = router;