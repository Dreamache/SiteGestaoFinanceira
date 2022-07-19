module.exports= function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Hey! that access is unauthorized, please Sign-in');
    res.redirect('/signin');
}   

// Autenticador com redirecionador para a pagina de signin e amostra de erro para acesso nao autorizado!