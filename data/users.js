const users = [];

const findUserByEmail = (email) => users.find(u => u.email === email);

const createUser = (user) => {
    users.push(user);
    return user;
};

module.exports = {
    users,
    findUserByEmail,
    createUser
};
