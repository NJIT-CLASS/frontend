/**
 * Created by Sohail on 7/23/2017.
 */
import React from 'react';
var ProgressBar = require('progressbar.js');

class BadgeProgressBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        var userPoint = this.props.UserPoints;
        console.log(userPoint + "   sadasdasdas'");
        var requirement = this.props.requirement;
        console.log(userPoint + "   ,dfnm'");

        var progressNumber = userPoint/requirement;
        console.log("ProgressNumber "+progressNumber);
        
        var progressBarContainer = document.querySelector(`#${this.props.badgeProgressBarID}`);
        var progressForCss = 0;
        if (progressNumber >= 1) {
            progressForCss = 100;
            progressNumber = "Completed";
        }else{
            progressForCss = progressNumber * 100;
            progressNumber = userPoint +" / "+ requirement;
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

    render(){
        return(
        <div className="displayProgress" id={`${this.props.badgeProgressBarID}`}></div>
        )
    }

}

export default BadgeProgressBar;