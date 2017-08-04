/**
 * Created by Sohail on 7/23/2017.
 * This file will create the Progess bar and it will display the progress numbers for the user/Frontend.
 */
import React from 'react';
var ProgressBar = require('progressbar.js');
var dontShowProgress = false;

/*
* dontShowProgress will initially be false
* but if a requirement is greater than userPoints then it will be true
* this could conflict if the user changes category
* so for that we have a if statement which will check that if the value passed by badgeDisplay is for Bronze badge then change the value of dontshowprogress to false;
* */

class BadgeProgressBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    //Will render the data
    componentDidMount() {
        var userPoint = this.props.UserPoints; //User points
        var requirement = this.props.requirement; //Requirement to earn the points
        var progressNumber = userPoint/requirement; //Their progress

        //Change the value of dontShowProgress to false if the data is for bronze Bage
        if(this.props.badgeProgressBarID == "bronzeBadge") {
            dontShowProgress = false;
        }

        //Progress Bar
        var progressBarContainer = document.querySelector(`#${this.props.badgeProgressBarID}`);
        var progressForCss = 0;//
        //If student progress is 1 or greater than 1 (see progressNumber variable on line 27) then show completed under the badge progress
        if (progressNumber >= 1) {
            progressForCss = 100;
            progressNumber = "Completed";
        }else{
            if(dontShowProgress){
                progressForCss = 0;
                progressNumber = "Previous Badge Incomplete"
            }else{
                progressForCss = progressNumber * 100;
                progressNumber = userPoint +" / "+ requirement;
            }
        }

        //Progressbar
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
                    bar.setText(progressNumber);//Number under the progress Bar
            }
        });

        bar.animate(1.0);  // Number from 0.0 to 1.0

        //If they are still working on current badge then set dontShowProgress as true
        if(requirement > userPoint){
            dontShowProgress = true;
        }
    }

    //If the data is changed without reloading the page then this function will take place
    componentWillReceiveProps(nextProps) {
        //Remove previous Progressbar and number using the if statement
        if(this.props.badgeProgressBarID == "bronzeBadge") {
            document.getElementById('bronzeBadge').innerHTML = "";
            dontShowProgress = false;
        }else if(this.props.badgeProgressBarID == "silverBadge") {
            document.getElementById('silverBadge').innerHTML = "";
        }else if(this.props.badgeProgressBarID == "goldBadge") {
            document.getElementById('goldBadge').innerHTML = "";
        }
        var userPoint = nextProps.UserPoints; //User points
        var requirement = nextProps.requirement; //Requirement to earn the points
        var progressNumber = userPoint/requirement; //Their progress
;

        var progressBarContainer = document.querySelector(`#${nextProps.badgeProgressBarID}`);
        var progressForCss = 0;
        if (progressNumber >= 1) {
            progressForCss = 100;
            progressNumber = "Completed";
        }else{
            //If previous badge is not complete
            if(dontShowProgress){
                progressForCss = 0;//progress bar will be 0 if the previous badge is not completed
                progressNumber = "Previous Badge Incomplete";//Will display this if the previous badge is not completed
            }else{
                progressForCss = progressNumber * 100; // progress bar
                progressNumber = userPoint +" / "+ requirement;//number under then progress bar
            }
        }
        //Progress Bar
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
                bar.setText(progressNumber); //Number under the progress Bar
            }
        });

        bar.animate(1.0);  // Number from 0.0 to 1.0

        //If they are still working on current badge then set dontShowProgress as true
        if(requirement > userPoint){
            dontShowProgress = true;
        }
        console.log(dontShowProgress+ " sadashjksadhjkasdhjksahdjk" )
    }

    render(){
        return(
        <div className="displayProgress" id={`${this.props.badgeProgressBarID}`}></div>
        )
    }

}

export default BadgeProgressBar;