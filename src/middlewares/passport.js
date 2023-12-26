const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');

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
            if (!user) {
                return done(null, false);

            }
            const result = await user.comparePass(password);
            if (result) {
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


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_REDIRECT_URL,
},
    async function (accessToken, refreshToken, profile, cb) {
        console.log("accessToken: " + accessToken);
        console.log("refreshToken: " + refreshToken);
        console.log(profile);
        console.log(profile.id);

        // if (profile.email_verified) {
        try {
            const user = await User.findOne({ googleId: profile.id });
            console.log("User: " + user);
            if (!user) {

                const newProfile = {
                    username: crypto.randomBytes(16).toString('hex'),
                    password: crypto.randomBytes(16).toString('hex'),
                    email: profile._json.email,
                    avatar: profile._json.picture,
                    fullname: profile._json.name,
                    active: profile._json.email_verified,
                    googleId: profile.id,
                }
                const newUser = await User.create(newProfile);
                console.log("new User: ", newUser);
                cb(null, newUser);
            }
            else {
                User.findOneAndUpdate({ googleId: profile.id }, {
                    avatar: profile._json.picture,
                    fullname: profile._json.name,
                    active: profile._json.email_verified,
                    googleId: profile.id,
                })
                cb(null, user);
            }

        }
        catch (err) {
            console.log("error: ", err);
            cb(err, null);
        }
        // }
        // else {

        // }
    }
));