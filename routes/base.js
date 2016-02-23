const express = require('express');
//custom translation script
var i18n = require('i18n');

const cryptoJS = require('crypto-js');

const consts = require('../utils/constants');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('home', {
            title: res.__('CLASS Home')
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

    });
});

module.exports = router;