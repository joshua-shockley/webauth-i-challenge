const db = require('../data/dbConfig.js');

module.exports = {
    addUser,
    find,
    findBy,
    findById,
    update,
    remove

}

function find() {
    return db('users')
        .select('id', 'username', 'password', 'email');
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

function update(changes, id) {
    return db('users')
        .where({ id: id })
        .update(changes)
        .then(() => {
            return findById(id);

        });
}

function remove(id) {
    return db('users')
        .where({ id })
        .del();
}