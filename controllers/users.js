'use strict';

module.exports = function(_,passport,User,LogoutHelper) {

    return {

        setRouting : function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);
            router.get('/logout',LogoutHelper.logout);
            


            router.post('/signup',User.SignUpValidation, this.postSignUp);
            router.post('/',User.LoginValidation, this.postLogin);
            
            
        },

        getDashboard : (req,res) => {
          
            res.render('dashboard', {title: 'chatter | admin'});
        },


        indexPage : (req,res) => {

            if(req.session.passport){
                res.redirect('/home');
            }
            else{
            const errors = req.flash('error');
            return res.render('index', {title: 'chatter | login', messages: errors, hasErrors: errors.length > 0});
            }
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

        getFacebookLogin: passport.authenticate('facebook',{
            scope: 'email'
        }),

        facebookLogin: passport.authenticate('facebook',{
            successRedirect : '/home',
            failureRedirect : '/signup',
            failureFlash : true
        }),

        getGoogleLogin: passport.authenticate('google',{
          //  scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
        scope: ['profile','email']
        }),

        googleLogin: passport.authenticate('google',{
            successRedirect : '/home',
            failureRedirect : '/signup',
            failureFlash : true
        }),

      
    }
}