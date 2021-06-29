const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const { User } = require('../models/user');
const { History } = require('../models/history');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = 'public/images/';
    fs.mkdirSync(path, { recursive: true });
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', upload.single('photo'), (req, res) => {
  var body = req.body;
  var password = Math.floor(100000 + Math.random() * 900000).toString();

  if (req.file == undefined) {
    return res.status(400).json({ message: 'Image not received!' });
  }

  console.log(password)

  body.photo = '/images/' + req.file.filename;
  body.password = password;
  body.encryptedPassword = User.hashPassword(password);

  const user = new User(body);
  user.save((err) => {
    if (err) return res.status(400).json(err);
    res.status(200).json({ message: 'Successfully registered.' })
  });
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return res.status(401).json(err); }
    if (!user) { return res.status(401).json(info); }

    req.logIn(user, function (err) {
      if (err) { return res.status(401).json(err); }

      const history = new History({ userId: user._id });
      history.save();

      return res.status(200).json({
        message: 'Welcome back', user: user
      });
    });
  })(req, res, next);
})

router.post('/reset-password/:id', (req, res) => {
  const id = req.params.id;
  const password = req.body.password;
  const encryptedPassword = User.hashPassword(password);

  User.findByIdAndUpdate({ _id: id },
    { password: password, encryptedPassword: encryptedPassword })
    .exec((err, user) => {
      if (err) return res.status(400).json(err);
      res.status(200).json({ message: 'Password successfully changed.' })
  })
})

module.exports = router;
