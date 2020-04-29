// middleware for login functions
function authenticationMiddleware () {
    return (req, res, next) => {
        req.authentication = {
            setUserId: id => req.session.userId = id,
            getUserId: () => req.session.userId || null,
            logout: () => req.session.destroy(() => {
            })
        };

        next();
    };
}

// short-hand per-route middleware to make that route
// accessible to authenticated users only.
function requiresLogin () {
    return (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('/login?from=' + req.originalUrl);
        } else {
            next();
        }
    };
}

module.exports = {
    authenticationMiddleware,
    requiresLogin
};
