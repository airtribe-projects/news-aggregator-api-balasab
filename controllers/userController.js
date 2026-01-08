const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../data/users');

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Helper to find user by email
const findUser = (email) => users.find(u => u.email === email);

const signup = async (req, res) => {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }

    if (findUser(email)) {
        return res.status(400).send('User already exists');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword,
            preferences: preferences || []
        };
        users.push(newUser);
        res.status(200).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = findUser(email);

    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
};

const getPreferences = (req, res) => {
    const user = findUser(req.user.email);
    if (!user) return res.status(404).send('User not found');
    res.json({ preferences: user.preferences });
};

const updatePreferences = (req, res) => {
    const { preferences } = req.body;
    const user = findUser(req.user.email);
    if (!user) return res.status(404).send('User not found');

    if (!Array.isArray(preferences)) {
        return res.status(400).send('Preferences must be an array');
    }

    user.preferences = preferences;
    res.status(200).send('Preferences updated');
};

module.exports = {
    signup,
    login,
    getPreferences,
    updatePreferences
};
