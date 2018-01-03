const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const container = require('./container');

const port = process.env.PORT || 3000 ;





container.resolve(function(users,_)
{
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/chatter');
   
    setupExpess();


    function setupExpess(){
        const app = express();
        const server = http.createServer(app);
        server.listen(port,(err)=>{
            if(err) return console.log("unable to connect to the server");
            console.log(`connected to ${port}`);
        });

        expressConfiguration(app);

        //Setup router 
        const router = require('express-promise-router')();
        users.setRouting(router);
        app.use(router);

        
    }

    function expressConfiguration(app){


        require('./passport/passport-local');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended : true}));
        app.set('view engine','ejs');

        app.use(validator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized : false,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
       
        
    }



})