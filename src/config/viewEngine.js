const path = require("path");
const express = require("express")

const configviewEngine = (app) => {

    // View giong android.
    app.set("views", path.join("./src", "views"))
    app.set("view engine", "ejs")

    // static file => tai nguyen 
    app.use(express.static(path.join("./src", "public")));
}
module.exports = configviewEngine;