const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session'); //must be listed before knexSessionStore and knexConfig-it wont see it if its not in order
const knexSessionStore = require('connect-session-knex')(session);
const knexConfig = require('./data/dbConfig.js');
const bcrypt = require('bcryptjs');


const db = require('./data/dbConfig.js');
const Users = require('./helperModel/user-model.js');
const protected = require('./auth/protected.js');
const UserAuthRouter = require('./helperModel/userAuthRouter.js');
const server = express();

const sessionConfig = {
    name: 'turtle',
    secret: 'i am the one and only secret',
    cookie: {
        maxAge: 1000 * 60 * 60, //this is how long the cookie is good for. 1000=1sec *60 makes it a minute the *60 makes it 60minutes.
        secure: false,
        httpOnly: true, //remember this prevents using javascript to access it.
    },
    resave: false, // do not recreate session when changed?
    saveUninitialized: true, // prevents (when false in production) from creating cookies automatically without client permission it a legal thing look up GDPR laws
    //this is where the store goes if gonna use it.
    store: new knexSessionStore({
        knex: knexConfig, //need to make this above
        createtable: true, //needs to be in lowercase for some odd reason
        clearInterval: 100 * 60 * 30, // same for time expiration as above for maxAge.. this clears the database of the unused cookies.    
    })
};


//global middleware
server.use(logger);
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));


server.use('/api/auth/', protected, UserAuthRouter);

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
                    req.session.userId = user.id;
                    res.status(200).json({ message: `${user.username} is now logged in` });
                    console.log(req.session);

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

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.json({ message: 'you did not logout yet.. try again...lol' });
            } else {
                res.status(200).json({ message: 'successful logout, see ya later' });
            };
        })
    } else {
        res.status(200).json({ message: 'thats funny... you were never logged in' });
    };
});


function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
}


module.exports = server;