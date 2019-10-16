const express = require('express');

const Users = require('./user-model.js');

const router = express.Router();


//get users w/ hash
router.get('/users', (req, res) => {
    Users.find()
        .then(all => {
            res.status(200).json(all);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    Users.findById(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.put('/users/:id', (req, res) => {
    const id = req.params.id;
    let changes = req.body;
    Users.findById(id)
        .then(user => {
            if (user) {
                Users.update(changes, id)
                    .then(updated => {
                        res.status(201).json(updated);
                    })
            } else {
                res.status(404).json({ message: 'could not find user with given id' });
            };
        })
        .catch(error => {
            console.log('in catch', id, changes);
            res.status(500).json({ message: 'failed to update user' });
        });
});

router.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    Users.remove(id)
        .then(gone => {

            res.status(200).json({ message: 'they gone now!' });;
        })
        .catch(error => {
            res.status(500).json(error);
        });
});




module.exports = router;