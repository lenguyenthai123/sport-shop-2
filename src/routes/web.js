const express = require("express")
const router = express.Router();

const { getHomePage } = require("../controllers/homeControllers");

router.get("/", getHomePage);
module.exports = { router };
