"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const googleRouter = (0, express_1.Router)();
// Initialize Passport
googleRouter.use(passport_1.default.initialize());
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
// Configure Google Strategy
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile'],
}, (accessToken, refreshToken, profile, done) => {
    return done(null, Object.assign({ accessToken }, profile));
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
googleRouter.get('/auth/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            message: 'Successfully Loged In',
            user: req.user,
        });
    }
    else {
        res.status(403).json({ error: true, message: 'Not Authorized' });
    }
});
// Routes
googleRouter.get('/login/failed', (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    });
});
googleRouter.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
googleRouter.get('/auth/google/callback', passport_1.default.authenticate('google', {
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: '/auth/login/failed',
}));
googleRouter.get('/logout', (req, res) => {
    // req.logout(done());
    res.redirect('/');
});
exports.default = googleRouter;
