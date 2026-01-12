const axios = require('axios');
const { findUserByEmail } = require('../data/users');

const getNews = async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).send('User not authenticated');
    }

    const user = findUserByEmail(req.user.email);
    if (!user) return res.status(404).send('User not found');

    // MOCK IMPLEMENTATION (matches previous logic)
    const mockNews = [
        { title: 'Superman returns', category: 'comics' },
        { title: 'New Marvel movie announced', category: 'movies' },
        { title: 'Tech startup raises millions', category: 'business' }
    ];

    const filteredNews = mockNews.filter(article =>
        user.preferences.length === 0 || user.preferences.includes(article.category)
    );

    // Return filtered news if matches found, otherwise return all news (or could return empty array if strict)
    // For now, retaining fallback behavior but making it explicit: if no preferences set OR no matches, show all.
    res.json({ news: filteredNews.length > 0 ? filteredNews : mockNews });
};

module.exports = { getNews };
