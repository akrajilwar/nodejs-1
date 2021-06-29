var express = require('express');
var { History } = require('../models/history');
var { User } = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/histories/:id', (req, res) => {
  const id = req.params.id;

  History.find({ userId: id }).sort({createdAt: -1}).exec((err, histories) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(histories);
  })
});

router.get('/users', (req, res) => {
  User.find({ role: 'user' }).sort({ createdAt: -1 }).exec((err, users) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(users);
  })
});

module.exports = router;
