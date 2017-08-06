/**
 * Created by Immanuel on 7/24/2017.
 */

import React from 'react';
var ProgressBar = require('progressbar.js');

class DisplayExperienceBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        var userPoint = this.props.Userpoints;
        console.log("userPoint: "+userPoint);
        var requirement = this.props.requirements;
        console.log("requirement: "+requirement);

        var progressNumber = userPoint/requirement;
        console.log("progressNumber: "+progressNumber);

        var progressBarContainer = document.querySelector(`#${this.props.progressBar}`);
        var progressForCss = 0;
        if (progressNumber >= 1) {
            progressForCss = 100;
            progressNumber = "Completed";
        }else{
            progressForCss = progressNumber * 100;
            progressNumber = userPoint + " / " + requirement + " Experience Points";
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
            <div className="displayingExperienceBar">

                <div id="achievementUnlockLevelName">Intermediate</div>
                <div id="achievementUnlockLevelAndProgressBar">
                    <div id="achievementUnlockLevelFrom">Level 5</div>

                    <div id="achievementUnlockLevelTo">Level 6</div>

                    <div className="displayProgress" id={`${this.props.progressBar}`}></div>
                </div>
            </div>

        );
    }
}

export default DisplayExperienceBar;