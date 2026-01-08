const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send('Access Denied');

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).send('Invalid Token');
    }
};

module.exports = { verifyToken, SECRET_KEY };
