import React from 'react';
import BadgeProgressBar from './badgeProgressBar';
var ProgressBar = require('progressbar.js');

class BadgeDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }




    //We will decided over here how it's supposed to look
    render() {
        var bronzeProgress = this.props.userPoints/this.props.requirement1;
        var silverProgress = this.props.userPoints/this.props.requirement2;
        var goldProgress = this.props.userPoints/this.props.requirement3;
        return (
            <div className="displayingBadgesWithProgressContainer">

                <div className="displayingBadgesWithProgress">
                    <img src={"/static/images/badgeImages/"+this.props.urlForBronzeBadge} alt={this.props.bronzeBadgeDescription} className="badgesImages"/>
                    <BadgeProgressBar UserPoints={this.props.userPoints}
                                      requirement={this.props.requirement1}
                                      badgeProgressBarID="bronzeBadge"/>
                </div>

                <div className="displayingBadgesWithProgress">
                    <img src={"/static/images/badgeImages/"+this.props.urlForSilverBadge} alt={this.props.silverBadgeDescription} className="badgesImages"/>
                    <BadgeProgressBar
                        UserPoints={this.props.userPoints}
                        requirement={this.props.requirement2}
                         badgeProgressBarID="silverBadge"/>
                </div>

                <div className="displayingBadgesWithProgress">
                    <img src={"/static/images/badgeImages/"+this.props.urlForGoldBadge} alt={this.props.goldBadgeDescription} className="badgesImages"/>
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
