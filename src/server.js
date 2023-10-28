const express = require('express')
const path = require("path")
const configviewEngine = require("./config/viewEngine.js")
const { router } = require("./routes/web.js")
const connection = require("./config/database.js")
const connectionMongo = require("./config/dbMongo.js");
const cookieParser = require('cookie-parser')
require("dotenv").config()

const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Config the post request is in object by json and suitable for form
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

// config view engine
configviewEngine(app)




// config router
app.use("/", router);


//Middleware not found 
app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
})

// Middleware handler error
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    return res.status(status).json({
        message: error.message
    })
})

// QUery database

const start = async () => {
    try {
        await connectionMongo(process.env.MONGO_URI1);
        app.listen(port, hostname, () => {
            console.log("Listening on port " + port)
        })
    } catch (error) {
        console.log(error);
    }
}

start();
