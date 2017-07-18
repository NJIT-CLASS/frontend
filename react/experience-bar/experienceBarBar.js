/**
 * Created by Sohail and Immanuel on 7/16/2017.
 */

import React from 'react';
var ProgressBar = require('progressbar.js');

class ExperienceBarBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        var progressBarContainer = document.querySelector(`#container${this.props.badgeKey}`);
        var progressNumber = this.props.Progress;
        if (progressNumber == 100) {
            progressNumber = "Completed";
        }
        var bar = new ProgressBar.Line(progressBarContainer, {
            strokeWidth: 3,
            easing: 'easeInOut',
            duration: 2000,
            color: 'green',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: this.props.Progress + "%", height: '10px'},
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
                if (progressNumber != "Completed") {
                    bar.setText(Math.round(bar.value() * progressNumber) + ' %');
                } else {
                    bar.setText(progressNumber);
                }
            }
        });

        bar.animate(1.0);  // Number from 0.0 to 1.0

        render()
        {
            return (
                <div className="displayingExperienceBarBar">

                    <div className="displayProgress" id={`container${this.props.badgeKey}`}></div>

                </div>

            );

        }
    }
}

export default ExperienceBarBar;