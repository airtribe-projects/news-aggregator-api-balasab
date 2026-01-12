const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../data/users');
const { SECRET_KEY } = require('../middlewares/authMiddleware');

const validatePassword = (password) => {
    // Min 8 chars, at least one letter and one number
    // Allows any characters as long as length >= 8, has letter, has number
    const re = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return re.test(password);
};

const signup = async (req, res) => {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }

    if (!validatePassword(password)) {
        return res.status(400).send('Password must be at least 8 characters long and contain at least one letter and one number');
    }

    if (findUserByEmail(email)) {
        return res.status(400).send('User already exists');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword,
            preferences: preferences || [],
            role: 'user' // Default role
        };
        createUser(newUser);
        res.status(200).send('User registered successfully');
    } catch (err) {
        // console.error(err); // Optional logging
        res.status(500).send('Error registering user');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    try {
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                role: user.role
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
};

const getPreferences = (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).send('User not authenticated');
    }
    const user = findUserByEmail(req.user.email);
    if (!user) return res.status(404).send('User not found');
    res.json({ preferences: user.preferences });
};

const updatePreferences = (req, res) => {
    const { preferences } = req.body;

    if (!req.user || !req.user.email) {
        return res.status(401).send('User not authenticated');
    }

    const user = findUserByEmail(req.user.email);
    if (!user) return res.status(404).send('User not found');

    if (!Array.isArray(preferences)) {
        return res.status(400).send('Preferences must be an array');
    }

    // Validate if preferences are strings (optional but good)
    if (!preferences.every(p => typeof p === 'string')) {
        return res.status(400).send('Preferences must be an array of strings');
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
