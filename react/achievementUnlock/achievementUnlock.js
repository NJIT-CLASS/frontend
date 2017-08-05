/**
 * Created by Sohail on 8/1/2017.
 */

import React from 'react';
var ProgressBar = require('progressbar.js');

class AchievementUnlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        var userPoint = "385";
        console.log(userPoint + "   sadasdasdas'");
        var requirement = "400";
        console.log(userPoint + "   ,dfnm'");

        var progressNumber = userPoint/requirement;
        console.log("ProgressNumber "+progressNumber);

        var progressBarContainer = document.querySelector("#temp");
        var progressForCss = 0;
        if (progressNumber >= 1) {
            progressForCss = 100;
            progressNumber = "Completed";
        }else{
            progressForCss = progressNumber * 100;
            progressNumber = userPoint +" / "+ requirement + "Experience Points";
        }
        var bar = new ProgressBar.Line(progressBarContainer, {
            strokeWidth: 3,
            easing: 'easeInOut',
            duration: 2000,
            color: 'green',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: progressForCss + "%", height: '10px'},
            text: {
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#999',
                    // position: 'absolute',
                    // right: '0',
                    // top: '30px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            step: (state, bar) => {
                bar.setText(progressNumber);
            }
        });

        bar.animate(1.0);  // Number from 0.0 to 1.0
    }
    /*
     * <div className="achievementImage">
     <img src="/static/images/badgeImages/golden_trophy.png" alt="Achievement Unlock" />
     </div>
     * */
    render()
    {
        return (
            <div className="displayingExperienceBarBar">

                <div id="achievementUnlockLevelName">Intermediate</div>
                <div id="achievementUnlockLevelAndProgressBar">
                    <div id="achievementUnlockLevelFrom">5</div>

                    <div id="achievementUnlockLevelTo">6</div>

                    <div className="displayProgress" id="temp"></div>
                </div>

                <div id="achievementUnlockClassGoals">

                    <h2 id="ClassGoalHeader">CLASS GOALS FOR THE SEMESTER</h2>
                    <div className="goalImageAndDescriptionWithPoints">
                        <img src="static/images/badgeImages/Certain_percent_complete-copper.png"  id="imagesForAchievementUnlock"/>
                        <p id="descriptionOfGoal">Submit 5 comments on others work</p>
                        <p id="goalPoints">READY- Not enough points to claim</p>
                    </div>

                    <div className="goalImageAndDescriptionWithPoints">
                        <img src="static/images/badgeImages/Certain_percent_complete-copper.png"  id="imagesForAchievementUnlock"/>
                        <p id="descriptionOfGoal">Submit 2 questions to other students</p>
                        <p id="goalPoints">0 out of 2</p>
                    </div>

                    <div className="goalImageAndDescriptionWithPoints">
                        <img src="static/images/badgeImages/Certain_percent_complete-copper.png"  id="imagesForAchievementUnlock"/>
                        <p id="descriptionOfGoal">Submit 2 solutions to other student</p>
                        <p id="goalPoints">1 out of 2</p>
                    </div>

                    <div className="goalImageAndDescriptionWithPoints">
                        <img src="static/images/badgeImages/Certain_percent_complete-copper.png"  id="imagesForAchievementUnlock"/>
                        <p id="descriptionOfGoal">Provide a grade to 2 other students</p>
                        <p id="goalPoints">1 out of 2</p>
                    </div>

                    <div className="goalImageAndDescriptionWithPoints">
                        <img src="static/images/badgeImages/Certain_percent_complete-copper.png"  id="imagesForAchievementUnlock"/>
                        <p id="descriptionOfGoal">Earn a gold badge</p>
                        <p id="goalPoints">Earned Extra Credit</p>
                    </div>

                    <div className="goalImageAndDescriptionWithPoints">
                        <img src="static/images/badgeImages/Certain_percent_complete-copper.png"  id="imagesForAchievementUnlock"/>
                        <p id="descriptionOfGoal">Earn a perfect grade</p>
                        <p id="goalPoints">0 out of 1</p>
                    </div>
                </div>

            </div>

        );
    }
}

export default AchievementUnlock;