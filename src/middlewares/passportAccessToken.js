const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const User = require("../model/User")
require("dotenv").config();
const opts = {}

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies["token"];
    }
    return token;
};
// ...
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const { username, id } = jwt_payload;
        const user = await User.findOne({ username: username });

        if (!user) {
            done(null, false);
        }
        done(null, user);


    } catch (error) {
        console.log("Loi");
        done(error);
    }
}));
passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({ username: username });

            if (!user) {
                done(null, false);
            }

            const result = await user.comparePass(password);
            if (result) {
                done(null, user);
            }
            else {
                done(null, false);
            }

        } catch (error) {
            done(error);
        }

    }
));
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});