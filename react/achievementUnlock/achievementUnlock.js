/**
 * Created by Sohail and Immanuel on 7/16/2017.
 */

import React from 'react';

class AchievementUnlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
        render()
        {
            return (
                <div className="displayingExperienceBarBar">

                    <div className="displayProgress" id={`container${this.props.badgeKey}`}>Hello</div>

                </div>

            );
        }
}

export default AchievementUnlock;