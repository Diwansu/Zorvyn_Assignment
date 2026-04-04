const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

const protect = async (req, res, next) => {
    let token; 

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer') 
    ) {
        token = req.headers.authorization.split(' ')[1]; 
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' }); 
    } 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret'); // verifying the token if not in env will use fallback_secret
        const user = await User.findById(decoded.id).select('-password'); // finding the user by id without password field.
        
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' }); 
        }
        
        if (user.status === 'inactive') {
            return res.status(403).json({ message: 'Not authorized, user is inactive' }); 
        }

        req.user = user; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' }); 
    }
};

module.exports = { protect };
