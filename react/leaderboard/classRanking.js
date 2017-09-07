/**
 * Created by Sohail on 7/28/2017.
 * This file will have data of students ranking among a class.
 */
import React from 'react';
import apiCall from '../shared/apiCall';
import Tooltip from '../shared/tooltip';

class ClassRanking extends React.Component {
    constructor(props){
        super(props);
        this.state = {classRanking: []};
    }

    //Fetch Class Ranking Data From Backend
    fetchClassRankingData(nextProps) {
        

        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        apiCall.get(`/getSectionRanking/${nextProps.SemesterID}/${nextProps.CourseID}/${nextProps.SectionID}/${nextProps.UserID}`,(err, response, body) => {
            this.setState({
                classRanking: body.students,//body.whatever we need from api
                studentPoints: body.currentStudent.TotalPoints, // Total points of the student
                lastUpdated: body.currentStudent.UpdateDate //Ranking Last Updated
            });
        });
    }


    //Will render the data
    componentWillMount(){
        this.fetchClassRankingData(this.props);
    };
    //If the data is changed without reloading the page then this function will take place
    componentWillReceiveProps(nextProps){
        this.fetchClassRankingData(nextProps);
    };

    //Student ranking coming from backend
    render(){
        //Class Ranking List
        //Organizing Data received from backend and placing it to where it needs to go
        let classRankingList = this.state.classRanking.map(klassRank => {
            return <div className="classRankingRanks" id={`classRankingTop${klassRank.Rank}`}>
                <div id="classRankingNameAndPointContainer">
                    <h2 className="classRankingStudentNames">{klassRank.Rank}. {klassRank.FirstName} {klassRank.LastName}</h2>
                    <div className="classRankingPoints">{klassRank.TotalPoints} points</div>
                </div>
                <div className="classRankingImageContainer"  id={`classRankingImage${klassRank.Rank}`}>
                    <img className="classRankingAvatars" src={`static/images/badgeImages/${klassRank.ProfilePicture}`} />
                </div>
                <div className="classRankingClearingDiv"></div>
            </div>;
        });

        //Here we have students points, updated date, and other students rankings.
        return (

            <div className="section card-2">
                <h2 id="classRankingTitle" className="title" >Class Ranking
                    <div id="ClassRankingToolTip"><Tooltip Text="This section displays your class ranking based on the total number of points earned to date. Updated hourly or daily" ID="ClassRankingToolTip" /></div>
                </h2>
                <div id="classRankingStudentPointArea"><p>Your Points: {this.state.studentPoints}</p></div>
                <div id="classRankingStudentList">
                    {classRankingList}
                </div>


                <p id="classRankingLastUpdated">Last Updated:{this.state.lastUpdated} </p>
            </div>

        );
    }
}


export default ClassRanking;