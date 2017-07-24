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

        this.state = {userProgress: []};
    }

    fetchBadgeData() {
        const fetchOptionsForProgress = {
            method: 'GET',
            //'/api/{add the string or name that amoudo has made}
            uri: this.props.apiUrl + '/api/userProgress/' + this.props.UserID +"/" +this.props.BadgeCategory,
            json: true
        };


        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        request(fetchOptionsForProgress,(err, response, body) => {
            console.log(body);
            this.setState({
                userProgress: body.progress//body.whatever we need from api
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
        /*let badgeArray = [{Progress: 100, urlForBadge: "HigherGradeBadge-copper.png", key: 1},
            {Progress: 100, urlForBadge: "HigherGradeBadge-silver.png",key: 2},
            {Progress: 45, urlForBadge: "HigherGradeBadge-golden.png",key: 3}];*/

        let badgeDisplay = this.state.userProgress.map(badge => {
            return <BadgeDisplay requirement1={badge.Tier1Instances}
                                 requirement2={badge.Tier2Instances}
                                 requirement3={badge.Tier3Instances}
                                 urlForBronzeBadge={badge.Badges[0].logo}
                                 urlForSilverBadge={badge.Badges[1].logo}
                                 urlForGoldBadge={badge.Badges[2].logo}
                                 bronzeBadgeDescription={badge.Badges[0].Description}
                                 silverBadgeDescription={badge.Badges[1].Description}
                                 goldBadgeDescription={badge.Badges[2].Description}
                                 badgeKey={badge.CategoryID}
                                 userPoints={badge.UserPoints[0].PointInstances}
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