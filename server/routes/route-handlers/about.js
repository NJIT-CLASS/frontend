
// exports.get = (req, res) => {
//     if(req.App.user === undefined){
//         return res.redirect('/');
//     }
//     res.render('about');
// };

exports.get = (req, res) => {
//     if(req.App.user === undefined){
//        return res.redirect('/');
//    }
    res.render('about_react', {
        scripts: ['/static/react_apps.js']
    });
};