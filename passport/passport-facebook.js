'use strict';

const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');
// const secret = require('../secrets/secretFile');
const secret = {
    facebook: {
        clientID:'139347173422628',
        clientSecret: '305904d99e04c0e79dcf69242fb06404',
       

    },

    google: {
        clientID: '350979007673-5mu3dotu22vn6jalvppvn2hl4ibira88.apps.googleusercontent.com',
        clientSecret: 'D7MwPXWnhgy8uA2f92hJDHwQ',
    }
}

const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {

    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email','displayName','photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true,
}, (req, token, refreshToken, profile, done) => {
    
    User.findOne({'facebook':profile.id}, (err, user) => {
        if(err){
           return done(err);
        }
        

        if(user){ 
            return done(null,user);
        }
        else{
            const newUser = new User();
            newUser.username = profile.displayName;
            newUser.facebook = profile.id;
            newUser.fullName = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            newUser.fbTokens.push({token});

            newUser.save((err,user)=>{

                if(err) return console.log(err);
                return done(null,user);
            })

        }
        
     
       
    });
}));