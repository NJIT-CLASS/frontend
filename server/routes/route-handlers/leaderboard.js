/**
 * Created by Sohail and Immanuel on 6/11/2017.
 */


import {API_URL} from '../../utils/react_constants';
exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('leaderboard');
};
