/**
 * Created by Sohail on 6/6/2017.
 */
import {API_URL} from '../../utils/react_constants';
exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('badges');
};
