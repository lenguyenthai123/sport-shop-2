const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    res.render("sample.ejs")
})

router.get("/abc", (req, res) => {
    res.send("Hello World!")
})

module.exports = router;