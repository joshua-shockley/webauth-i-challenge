const db = require('../data/dbConfig.js');

module.exports = {
    addUser,
    find,
    findBy,
    findById,

}

function find() {
    return db('users')
        .select('id', 'username', 'password');
}

function addUser(user) {
    return db('users')
        .insert(user, 'id')
        .then(([id]) => {
            return findById(id);
        });
}

function findBy(filter) {
    return db('users')
        .where(filter);
}

function findById(id) {
    return db('users')
        .where({ id })
        .first();
}