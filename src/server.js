const express = require('express')
const path = require("path")
const configviewEngine = require("./config/viewEngine.js")
const { router, routerApi } = require("./routes/web.js")
const connection = require("./config/database.js")
const connectionMongo = require("./config/dbMongo.js");
require("dotenv").config()

const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Config the post request is in object by json and suitable for form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config view engine
configviewEngine(app)




// config router
app.use("/", router);
app.use("/api", routerApi);

// QUery database

const start = async () => {
    try {
        await connectionMongo(process.env.MONGO_URI);
        app.listen(port, hostname, () => {
            console.log("Listening on port " + port)
        })
    } catch (error) {
        console.log(error);
    }
}

start();
