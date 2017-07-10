import React from 'react';
var ProgressBar = require('progressbar.js');

class BadgeDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        var progressBarContainer = document.querySelector(`#container${this.props.badgeKey}`);
        var bar = new ProgressBar.Line(progressBarContainer, {
            strokeWidth: 3,
            easing: 'easeInOut',
            duration: 2000,
            color: 'green',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: this.props.Progress+"%", height: '10px'},
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
                bar.setText(Math.round(bar.value() * this.props.Progress) + ' %');
            }
        });

        bar.animate(1.0);  // Number from 0.0 to 1.0

//CIRCLE
/*        var bar = new ProgressBar.Circle(container, {
            strokeWidth: 6,
            easing: 'easeInOut',
            duration: 1400,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: null
        });

        bar.animate(1.0);*/

    };


    //We will decided over here how it's supposed to look
    render() {
        return (
            <div className="displayingBadgesWithProgress">

                <img src={"/static/images/"+this.props.urlForBadge} alt="g" className="badgesImages"/>
                <div className="displayProgress" id={`container${this.props.badgeKey}`}></div>

            </div>

        );

    }
}

export default BadgeDisplay;
