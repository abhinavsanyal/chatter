'use strict';

module.exports = function(_,passport,User) {

    return {

        setRouting : function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage)

            router.post('/signup',User.SignUpValidation, this.postSignUp);
            router.post('/',User.LoginValidation, this.postLogin);
            
        },

        indexPage : (req,res) => {
            const errors = req.flash('error');
            return res.render('index', {title: 'chatter | login', messages: errors, hasErrors: errors.length > 0});
        },

        homePage : (req,res) => {
            res.render('home');
        },


        getSignUp : (req,res) => {
            const errors = req.flash('error');
            return res.render('signup', {title: 'chatter | SignUp', messages: errors, hasErrors: errors.length > 0});
        },

        postSignUp : passport.authenticate('local.signup',{
            successRedirect : '/home',
            failureRedirect : '/signup',
            failureFlash : true
        }),

        postLogin : passport.authenticate('local.login',{
            successRedirect : '/home',
            failureRedirect : '/',
            failureFlash : true
        }),
    }
}