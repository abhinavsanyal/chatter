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
const socketIO = require('socket.io');

const {Users} =require('./helpers/UsersClass');
const {Global} =require('./helpers/Global');

const compression = require('compression');
const helmet = require('helmet');

const container = require('./container');

const port = process.env.PORT || 3000 ;





container.resolve(function(_,users,admin,home,group,results,privateChat,profile,interests,news)
{
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://reltronx:A711961a!@ds213118.mlab.com:13118/chatter',(err)=>{
        if(err) return console.log('connection error');
    });

    

    setupExpess();


    function setupExpess(){
        const app = express();
        const server = http.createServer(app);
        const io =  socketIO(server);
        server.listen(port,(err)=>{
            if(err) return console.log("unable to connect to the server");
            console.log(`connected to ${port}`);
        });

        require('./socket/groupchat')(io,Users);
       require('./socket/friend')(io);
       require('./socket/globalroom')(io,Global,_);
       require('./socket/privateMessage')(io);

        expressConfiguration(app);

        //Setup router 
        const router = require('express-promise-router')();
        users.setRouting(router);
        admin.setRouting(router);
        home.setRouting(router);
        group.setRouting(router);
        results.setRouting(router);
        privateChat.setRouting(router);
        profile.setRouting(router);
        interests.setRouting(router);
        news.setRouting(router);
        
        app.use(router);

        
    }

    function expressConfiguration(app){

        app.use(compression());
        app.use(helmet());

        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

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