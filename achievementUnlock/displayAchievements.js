/**
 * Created by Immanuel on 7/24/2017.
 */

import React from 'react';

class DisplayAchievements extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    render()
    {
        return (
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

        );
    }
}

export default DisplayAchievements;