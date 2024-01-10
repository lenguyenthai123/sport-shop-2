const express = require('express')
const multer = require("multer");

const path = require("path")
const configviewEngine = require("./config/viewEngine.js")


const router = require("./routes/index.js");

// const connection = require("./config/database.js")
const connectionMongo = require("./config/dbMongo.js");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const configSession = require("./config/session.js");

require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000;
// const hostname = process.env.HOST_NAME;

// Config the post request is in object by json and suitable for form
// Middleware

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(cookieParser())

configSession(app);

// config view engine
configviewEngine(app)


// config router
app.use("/", router);

app.use((req, res, next) => { try { res.render("404.ejs") } catch (error) { next(error) } })


//Middleware not found 
app.use((req, res, next) =>    {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
})

// Middleware handler error
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    return res.status(status).json({ err });
})

// QUery database

const start = async () => {
    try {

        await connectionMongo();
        app.listen(port, () => {
            console.log("Listening on port " + port)
        })
    } catch (error) {
        console.log(error);
    }
}

start();
