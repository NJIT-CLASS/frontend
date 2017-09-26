/* Created by Sohail on 6/29/2017.
* This file will Display the badge Images and will send data to badgeProgressBar file to calculate the progress bar and percentahe
*/

import React from 'react';
import BadgeProgressBar from './badgeProgressBar';
var ProgressBar = require('progressbar.js');

class BadgeDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    //Send Data to Badge Progress Bar to create a progress bar along with the numbers underneath
    //Display Badge Images Received from Backend
    //Look at badgeProgressBarID to see which div contains which badge Info.
    render() {
        return (
            //Contains all the Badges with Progress bar and number
            <div className="displayingBadgesWithProgressContainer">

                <div className="displayingBadgesWithProgress">
                    <img src={'/static/images/badgeImages/'+this.props.urlForBronzeBadge} alt={this.props.bronzeBadgeDescription} className="badgesImages"/>
                    <BadgeProgressBar UserPoints={this.props.userPoints}
                        requirement={this.props.requirement1}
                        badgeProgressBarID="bronzeBadge"/>
                </div>

                <div className="displayingBadgesWithProgress">
                    <img src={'/static/images/badgeImages/'+this.props.urlForSilverBadge} alt={this.props.silverBadgeDescription} className="badgesImages"/>
                    <BadgeProgressBar
                        UserPoints={this.props.userPoints}
                        requirement={this.props.requirement2}
                        badgeProgressBarID="silverBadge"/>
                </div>

                <div className="displayingBadgesWithProgress">
                    <img src={'/static/images/badgeImages/'+this.props.urlForGoldBadge} alt={this.props.goldBadgeDescription} className="badgesImages"/>
                    <BadgeProgressBar
                        UserPoints={this.props.userPoints}
                        requirement={this.props.requirement3}
                        badgeProgressBarID="goldBadge"/>
                </div>

            </div>

        );

    }
}

export default BadgeDisplay;
