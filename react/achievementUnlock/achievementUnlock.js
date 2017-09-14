/**
 * Created by Sohail on 8/1/2017.
 */

import React from 'react';
var ProgressBar = require('progressbar.js');

class AchievementUnlockBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    
    componentDidMount() {
        this.drawBar(this.props);
    }
    componentWillReceiveProps(nextProps) {
        let {Strings, Record} = nextProps;
        
        var userPoint = Record.Exp;
        var requirement = Record.ThresholdPoints;

        var progressNumber = userPoint/requirement;
        var percentage = userPoint/requirement;
        var progressForCss = userPoint;
        if (progressNumber >= 1) {
            progressForCss = requirement;
            progressNumber = Strings.Completed;
        }else{
            progressForCss = progressNumber * 100;
            progressNumber = userPoint +'/'+ requirement + ' ' + Strings.ExperiencePoints;
        }
        this.Bar.setText(progressNumber);
        this.Bar.animate(percentage);  // Number from 0.0 to 1.0        
    }

    drawBar(props) {
        let {Strings, Record} = props;

        var userPoint = Record.Exp;
        var requirement = Record.ThresholdPoints;

        var progressNumber = userPoint/requirement;
        var percentage = userPoint/requirement;
        var progressBarContainer = this.levelBar;
        var progressForCss = userPoint;
        if (progressNumber >= 1) {
            progressForCss = requirement;
            progressNumber = Strings.Completed;
        }else{
            progressForCss = progressNumber * 100;
            progressNumber = userPoint +'/'+ requirement + ' ' + Strings.ExperiencePoints;
        }
        var bar = new ProgressBar.Line(progressBarContainer, {
            strokeWidth: 3,
            easing: 'easeInOut',
            duration: 2000,
            color: 'green',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: '100%', height: '10px'},
            text: {
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#000',
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

        bar.animate(percentage);  // Number from 0.0 to 1.0

        this.Bar = bar;
    }
    
    render()
    {
        let {Strings, Record} = this.props;
        return (
            <div className="displayingExperienceBarBar" >
                <div className="points-section">
                    <div>{Strings.AvailablePoints}: {Record.AvailablePoints}</div>
                    <br />
                    <div>{Strings.EarnedECPoints}: {Record.UsedPoints}</div>
                </div>
                <div className="level-section">
                    <div id="achievementUnlockLevelFrom">{Strings.Level} {Record.Level}</div>
                    <div id="achievementUnlock" ref={(span) => { this.levelBar = span; }}></div>
                    <div id="achievementUnlockLevelTo">{Strings.Level} {Record.Level + 1} 
                        <br/><br/>
                         + {Record.AvailablePoints} {Record.AvailablePoints == 1? Strings.CLASSPoint : Strings.CLASSPoints}</div>
                </div>
            </div>

        );
    }
}

export default AchievementUnlockBar;