module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'Você precisa estar autenticado para esse acesso!');
        res.redirect('/login');
    },
    globalenvironment: function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.message = req.flash("error");
        next();
    }
}