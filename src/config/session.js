const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const express = require("express")
require("dotenv").config();

const store = new MongoDBStore({
    uri: 'mongodb+srv://lenguyenthai123:g76a1zu6pJwBRLFy@cluster0.ctwm4lc.mongodb.net/Hotel?retryWrites=true&w=majority',
    collection: 'mySessions',
});

const configSession = (app) => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
        store: store
    }));
    app.use(passport.authenticate('session'));
}

module.exports = configSession;