const axios = require('axios');
const users = require('../data/users');

const getNews = async (req, res) => {
    const user = users.find(u => u.email === req.user.email);
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

    res.json({ news: filteredNews.length > 0 ? filteredNews : mockNews });
};

module.exports = { getNews };
