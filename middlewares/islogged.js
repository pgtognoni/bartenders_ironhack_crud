const isLoggedIn = (req, res, next) => { 
    if(!req.session.user) {
        res.redirect('/')
    }
    next()
}

const isLoggedOut = (req, res, next) => {
    if(req.session.user) {
        res.redirect('/')
    }
    next()
}

const userlogged = (req, res, next) => {
    if (req.session.user) next()
    
}

module.exports = {
    userlogged,
    isLoggedIn,
    isLoggedOut
}