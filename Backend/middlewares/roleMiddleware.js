//rest parameter is used to pass multiple arguments to a function which will be stored in an array(ES6). 
//In this case, roles is an array of roles that are allowed to access the route.
//The authorize function returns a middleware function that checks if the user's role is in the allowed roles.

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { authorize };
