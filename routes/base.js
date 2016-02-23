const express = require('express');
//custom translation script
var i18n = require('i18n');
const router = express.Router();

router.get('/', (req, res) => {
	//console.log(res.__('Hello i18n'));
    res.render('home', {
        title: res.__('Hello i18n')
    });
});

module.exports = router;