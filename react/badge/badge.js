/**
 * Created by Sohail on 6/9/2017.
 * This file will send info to other files and then in the end will render the badges with progress bar
 */
import React from 'react';
import BadgeDisplay from './badgeDisplay';
import apiCall from '../shared/apiCall';

class Badge extends React.Component {
    constructor(props){
        super(props);
        this.state = {userProgressData: null, userProgressPointData: null};
    }

    fetchBadgeData(nextProps) {
        

        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        apiCall.get(`/userProgress/${nextProps.UserID}/${nextProps.BadgeCategory}`,(err, response, body) => {
            this.setState({
                userProgressData: body.progress.badges,//User Progress From backend related to Badge
                userProgressPointData: body.progress //User progress Data from backend
            });
        });
    }


    //Will render the data
    componentWillMount(){
        this.fetchBadgeData(this.props);
    };
    //If the data is changed without reloading the page then this function will take place
    componentWillReceiveProps(nextProps){
        this.fetchBadgeData(nextProps);
    };


    render(){
        //badgeDisplay will send all the data to badgeDisplay file for calculation.

        let badgeDisplay = null;
        let {Strings} = this.props;
        //If user progress data and user point data is not null then send the info to BadgeDisplay File
        if(this.state.userProgressData !== null && this.state.userProgressPointData !== null){

            badgeDisplay =  <BadgeDisplay requirement1={this.state.userProgressPointData.Tier1Instances}
                requirement2={this.state.userProgressPointData.Tier2Instances}
                requirement3={this.state.userProgressPointData.Tier3Instances}
                urlForBronzeBadge={this.state.userProgressData[0].logo}
                urlForSilverBadge={this.state.userProgressData[1].logo}
                urlForGoldBadge={this.state.userProgressData[2].logo}
                bronzeBadgeDescription={this.state.userProgressData[0].Description}
                silverBadgeDescription={this.state.userProgressData[1].Description}
                goldBadgeDescription={this.state.userProgressData[2].Description}
                badgeKey={this.state.userProgressPointData.CategoryID}
                userPoints={this.state.userProgressPointData.pointInstances}
            />;
        }
        return (

            <div className="section card-2">
                <h2 className="title">{Strings.BadgeEarned}</h2>
                <form className="section-content" >
                    {badgeDisplay}
                </form>
            </div>



        );
    }
}


export default Badge;