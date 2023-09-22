const express = require('express')
const path = require("path")
const configviewEngine = require("./config/viewEngine.js")
const webroutes = require("./routes/web.js")
const connection = require("./config/database.js")
require("dotenv").config();


const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// config view engine
configviewEngine(app)

// config router
app.use("/", webroutes);

// QUery database


app.listen(port, hostname, () => {
    console.log("Listening on port " + port)
})