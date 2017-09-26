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

        var percentage = userPoint/requirement;
        var progressForCss = userPoint;
        
        this.Bar.animate(percentage);  // Number from 0.0 to 1.0        
    }

    drawBar(props) {
        let {Strings, Record} = props;

        var userPoint = Record.Exp;
        var requirement = Record.ThresholdPoints;

        var percentage = userPoint/requirement;
        var progressBarContainer = this.levelBar;
        var progressForCss = userPoint;
        
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
            
        });

        bar.animate(percentage);  // Number from 0.0 to 1.0

        this.Bar = bar;
    }
    
    render()
    {
        let {Strings, Record} = this.props;
        let percentage = Record.Exp/ Record.ThresholdPoints;
        let progressNumber = `${Record.Exp}/${Record.ThresholdPoints}`;
        if (percentage >= 1) {
            progressNumber = Strings.Completed;
        }else{
            progressNumber += ' ' + Strings.ExperiencePoints;
        }
        return (
            <div className="displayingExperienceBarBar" >
                <div className="points-section">
                    <div>{Strings.AvailablePoints}: {Record.AvailablePoints}</div>
                    <br />
                    <div>{Strings.EarnedECPoints}: {Record.UsedPoints}</div>
                </div>
                <div className="level-section">
                    <div className="user-title">{Record.Title}</div>
                    <br />
                    <div id="achievementUnlockLevelFrom">{Strings.Level} {Record.Level}</div>
                    <div id="achievementUnlock">
                        <div ref={(span) => { this.levelBar = span; }}></div>
                        <div className="progress-text">{progressNumber}</div>
                    </div>
                    <div id="achievementUnlockLevelTo">{Strings.Level} {Record.Level + 1} 
                        <br/><br/>
                         + {Record.PlusPoint} {Record.PlusPoint == 1? Strings.CLASSPoint : Strings.CLASSPoints}</div>
                </div>
            </div>

        );
    }
}

export default AchievementUnlockBar;