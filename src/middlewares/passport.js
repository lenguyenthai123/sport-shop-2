const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../model/User")
require("dotenv").config();
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;


passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const { id, username } = jwt_payload;
        console.log("jwt_payload");
        const user = await User.findById(id);
        done(null, user);

    } catch (error) {
        done(error, null);
    }
}));

