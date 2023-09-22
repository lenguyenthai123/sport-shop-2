const express = require('express')
const path = require("path")
const configviewEngine = require("./config/viewEngine.js")
const webroutes = require("./routes/web.js")
const mysql = require("mysql2");

require("dotenv").config();


const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// config view engine
configviewEngine(app)

// config router
app.use("/", webroutes);

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    password: '123456',
    user: 'root',
    database: 'hoidanit'
})

connection.query(
    'select * from User where id=1',
    function (err, result, fields) {
        console.log(result);
    }
)

app.listen(port, hostname, () => {
    console.log("Listening on port " + port)
})