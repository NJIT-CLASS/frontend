/**
 * Created by Sohail and Immanuel on 6/9/2017.
 */
import React from 'react';
import request from 'request';
import BadgeDisplay from './badgeDisplay';
var ProgressBar = require('progressbar.js');

class Badge extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    fetchBadgeData() {
        const fetchOptions = {
            method: 'GET',
            //'/api/{add the string or name that amoudo has made}
            uri: this.props.apiUrl + '/api/badgeCategories/' + this.props.UserID,
            qs: {SemesterID: this.props.SemesterID},
            json: true
        };



        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        request(fetchOptions,(err, response, body) => {
            console.log(body);
            this.setState({
                //stuff we need from api
                badges: body.badges//body.whatever we need from api
            })
        });

    }



    componentWillMount(){
        this.fetchBadgeData(this.props);
    };
    componentWillReceiveProps(nextProps){
        this.fetchBadgeData(nextProps);
    };


    render(){

        //Change Object.keys(Workflow) to the api (So example if the api badges then it would be this.state.badges)
        //TaskActivity will be replaced by the things we need

        //badgeDisplay = Object.keys(Workflow).map(key => {
        //return <BadgeDisplay TaskActivity={Workflow[key]}

        //key is the ID from Database
        let badgeArray = [{Progress: 100, urlForBadge: "HigherGradeBadge-copper.png", key: 1},
            {Progress: 100, urlForBadge: "HigherGradeBadge-silver.png",key: 2},
            {Progress: 45, urlForBadge: "HigherGradeBadge-golden.png",key: 3}];

        let badgeDisplay = badgeArray.map(badge => {
            return <BadgeDisplay Progress={badge.Progress}
                                 urlForBadge={badge.urlForBadge}
                                 badgeKey={badge.key}
            />;
        });

        return (

            <div className="section card-2">
                <h2 className="title">Badge Earned</h2>
                <form className="section-content" >
                    {badgeDisplay}
                </form>
            </div>



        );
    }
}


export default Badge;