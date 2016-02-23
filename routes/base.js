const express = require('express');
<<<<<<< HEAD
//custom translation script
var i18n = require('i18n');
const router = express.Router();

router.get('/', (req, res) => {
	//console.log(res.__('Hello i18n'));
    res.render('home', {
        title: res.__('Hello i18n')
=======
const cryptoJS = require('crypto-js');

const consts = require('../utils/constants');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('home', {
            title: 'CLASS Home'
        });
    })
    .post((req, res) => {
        // once API is working replace 'fake_user_id' with real user id
        const encryptedUserId = cryptoJS.AES.encrypt('fake_user_id', consts.USER_SECRET).toString();
        res.cookie('user', encryptedUserId);
        res.redirect('/dashboard');
    });

router.route('/logout')
    .get((req, res) => {
        res.clearCookie('user');
        res.redirect('/');
    });

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'CLASS Dashboard'
>>>>>>> cae368242a589c497e97baa6ab8175dc74260455
    });
});

module.exports = router;