const bcrypt = require('bcryptjs');

const Users = require('../helperModel/user-model.js');

module.exports = function protected(req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                    // res.status(200).json({ message: 'now set this to next(); its working' });
                } else {
                    res.status(401).json({ message: 'you shall not pass!' });
                };
            })
            .catch(error => {
                res.status(500).json(error);
            });
    } else {
        res.status(400).json({ message: 'doesnt see the credentials.. please add some.' });
    };
}