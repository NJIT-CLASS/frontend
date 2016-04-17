exports.get = (req, res) => {
    res.render('password_reset', {
        title: 'Reset Password'
    });
};
