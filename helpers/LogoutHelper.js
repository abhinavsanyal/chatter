module.exports = function() {
    return {
        logout : function(req,res){
            req.logout();
            req.session.destroy((err)=>{
                res.redirect('/');
            })


        }
    }
}