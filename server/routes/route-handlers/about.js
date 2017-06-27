import {API_URL} from '../../utils/react_constants';

// exports.get = (req, res) => {
//     if(req.App.user === undefined){
//         return res.redirect('/');
//     }
//     res.render('about');
// };

exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect('/');
    }
    res.render('about_react', {
        scripts: ['/static/react_apps.js'],
        apiUrl: API_URL
    });
};