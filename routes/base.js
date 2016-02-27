const express = require('express');
//custom translation script
var i18n = require('i18n');

const cryptoJS = require('crypto-js');

const consts = require('../utils/constants');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        if (req.App.userId) {
            return res.redirect('/dashboard');
        }

        res.render('home', {
            title: 'CLASS Home',
            language: req.App.lang
        });
    })
    .post((req, res) => {
        req.App.api.post('/login', {emailaddress: req.body.email,password:req.body.password}, (err, statusCode, body) => {
            // send response here stuff here
            console.log(body);
            if(body.UserID.length > 0 && body.Message == 'Success'){
                const id = body.UserID[0].UserID;
                const encryptedUserId = cryptoJS.AES.encrypt(id.toString(), consts.USER_SECRET).toString();
                res.cookie('user', encryptedUserId);
                res.redirect('/dashboard');
            }else{
                res.render('home',{
                    error: true
                });
            }
        });
    });

router.route('/logout')
    .get((req, res) => {
        res.clearCookie('user');
        res.redirect('/');
    });

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'CLASS Dashboard',
        language: req.App.lang
    });
});

router.get('/reset', (req, res) => {
    res.render('reset', {
        title: 'Reset Password',
        language: req.App.lang
    });
});

module.exports = router;