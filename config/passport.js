const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
const passport = require('passport')

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, 
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        const newUser = {
            googleID: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try {
            let user = await User.findOne({ googleID: profile.id })
            // If there is a google account, then use it 
            if(user) {
                done(null, user)
            // If there is no google account, then create a new user
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        } catch(err) {
            console.log(err)
        }
        
    }))

    // The serializeUser() function sets an id as the cookie in the user's browser
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    // deserializeUser() function uses the id that has been set(serializeUser) to look up the user in the database and retrieve the user object with data.
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
