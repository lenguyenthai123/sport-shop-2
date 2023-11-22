const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const User = require("../components/user/userModel")
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
            console.log(user);
            if (!user) {
                return done(null, false);

            }
            console.log("11111")
            const result = await user.comparePass(password);
            if (result) {
                console.log("Yes");
                done(null, user);
            }
            else {
                return done(null, false);
            }

        } catch (error) {
            done(error);
            return;
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