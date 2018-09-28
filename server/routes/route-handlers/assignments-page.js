const async = require('async');
import { ROLES, canRoleAccess } from '../../utils/react_constants';

exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    res.render('assignments', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId
    });
};