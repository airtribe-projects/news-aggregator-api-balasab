const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/news', newsRoutes);

if (require.main === module) {
    app.listen(port, (err) => {
        if (err) {
            return console.error('Failed to start server:', err);
        }
        console.log(`Server is listening on ${port}`);
    });
}

module.exports = app;