/**
 * Created by Immanuel on 7/24/2017.
 */

import React from 'react';
import DisplayExperienceBar from "./displayExperienceBar";
import DisplayAchievements from "./displayAchievements";
var ProgressBar = require('progressbar.js');

class AchievementUnlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    render(){
        //displayExperienceBar will send all the data to displayExperienceBar file for calculation.

        let displayExperienceBar = null;

        //If user progress data and user point data is not null then send the info to displayExperienceBar File
        if(this.state.userProgressData !== null && this.state.userProgressPointData !== null){

            displayExperienceBar =  <DisplayExperienceBar requirement={this.state.userProgressPointData.requirement}
                                          userPoints={this.state.userProgressPointData.userPoints}
            />;
        }
        return (
            <div className="displayingExperienceBarBar">

                /* <DisplayExperienceBar/> */

                <div className="section card-2">
                    <h2 className="title">Experience Bar</h2>
                    <form className="section-content" >
                        {displayExperienceBar}
                    </form>
                </div>

                <DisplayAchievements/>

            </div>

        );
    }
}

export default AchievementUnlock;