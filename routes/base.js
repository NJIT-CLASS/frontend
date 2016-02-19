const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	req.App.Translate('Welcome to CLASS', (str) => {
		res.render('home', {
			title: 'CLASS Home',
			welcome: str
		});
	});
});

module.exports = router;