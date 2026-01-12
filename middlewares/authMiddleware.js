const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Bearer realm="News Aggregator"');
        return res.status(401).send('Access Denied: No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.setHeader('WWW-Authenticate', 'Bearer realm="News Aggregator"');
        return res.status(401).send('Access Denied: Malformed header');
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.setHeader('WWW-Authenticate', 'Bearer realm="News Aggregator", error="invalid_token"');
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send('Access Denied: Token expired');
        }
        res.status(401).send('Access Denied: Invalid Token');
    }
};

module.exports = { verifyToken, SECRET_KEY };
