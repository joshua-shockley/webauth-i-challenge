const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');
const Users = require('./helperModel/user-model.js');
const protected = require('./auth/protected.js');
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send(`<h2>hello! Peanut butter Jelly time!</h2>`);
});



// get users
server.get('/api/users', (req, res) => {
    Users.find()
        .then(all => {
            res.status(200).json(all);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

server.get('/api/users/:id', protected, (req, res) => {
    const id = req.params.id;
    Users.findById(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


//get users w/ hash
server.get('/api/users/loggedIn', protected, (req, res) => {
    Users.find()
        .then(all => {
            res.status(200).json(all);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

//post to users aka registration
server.post('/api/reg', (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);

    user.password = hash;

    Users.addUser(user)
        .then(theUser => {
            res.status(200).json(theUser);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});;

//get to login
server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    res.status(200).json({ message: `${user.username} is now logged in` });

                } else {
                    res.status(401).json({ message: 'credentials invalid' })
                }
            })
            .catch(error => {
                res.status(500).json(error);
            });
    } else {
        res.status(500).json({ message: 'apply credentials please' });
    };
});


const port = process.env.PORT || 6000;
server.listen(port, () => console.log(`\n running on port ${port} \n`));