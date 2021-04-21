const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../Validation/register');
const validateLoginInput = require('../../Validation/login');

const keys = require('../../config/keys');

const User = require('../../models/User');

//@route    GET api/admins/tests
//@dest     Test admins route
//@access   Public
router.get('/tests', (req, res) => res.json({ msg: "users WOrks" }));

//@route    POST api/admins/addadmin
//@dest     Register Admin
//@access   Private
router.post('/addadmin', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    console.log(req.user);
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = 'Email already exists'
            return res.status(400).json(errors);
        } else {

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    // res.json(newUser)
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

//@route    POST api/admins/login
//@dest     Login Admin / Returning JWT 
//@access   Public
// router.post('/login', (req, res) => {
//     const { errors, isValid } = validateLoginInput(req.body);

//     //Check Validdation
//     if (!isValid) {
//         return res.status(400).json(errors);
//     }

//     const email = req.body.email;
//     const password = req.body.password;

//     //find user by email
//     User.findOne({ email }).then(user => {
//         //check for user
//         if (!user) {
//             errors.email = 'User not Found!'
//             return res.status(404).json(errors);
//         }

//         //Check Password
//         bcrypt.compare(password, user.password).then(isMatch => {
//             if (isMatch) {
//                 //User Matched
//                 const payload = { id: user.id, name: user.name, avatar: user.avatar };

//                 //Sign Token
//                 jwt.sign(
//                     payload,
//                     keys.secretOrKey,
//                     { expiresIn: 3600 },
//                     (err, token) => {
//                         res.json({
//                             success: true,
//                             token: 'Bearer ' + token
//                         });
//                     });
//             } else {
//                 errors.password = 'Password Incorect!'
//                 return res.status(400).json(errors);
//             }
//         });
//     });
// });


module.exports = router;