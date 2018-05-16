'use strict';

const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    
    

    User.findOne({'email': email}, (err, user) => {
       if(err){
           return done(err);
       }
        
        if(user){
            return done(null, false, req.flash('error', 'User with email already exist'));
        }
        
      
        var newUser = new User();
        newUser.username = req.body.name;
        newUser.fullname = req.body.name;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

  
        
       newUser.save((err,user) => {

            if(err) return console.log('failure',err);
            console.log('done');
            done(null, user);
        });
       
        
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    
    User.findOne({'email': email}, (err, user) => {
        if(err){
           return done(err);
        }
        
        const messages = [];

       

        if(!user || !user.isValidPassword(password) ){
            messages.push('Email Does Not Exist or Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }
        
       // console.log( user.isValidPassword(password));
        return done(null, user);
    });
}));