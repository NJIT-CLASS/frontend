const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        title: 'CLASS Home',
        welcome: 'home.html'
    });
});

module.exports = router;