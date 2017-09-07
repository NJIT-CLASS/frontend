/**
 * Created by Sohail on 7/7/2017.
 * This file will display or generate the data for top movers.
 */
import React from 'react';
import apiCall from '../shared/apiCall';
import Tooltip from '../shared/tooltip';


class TopMovers extends React.Component {
    constructor(props){
        super(props);

        this.state = {topMovers: [], topMoversPointMovement: [], topMoversUpdateDate:[]};
    }
    //Fetch Top Movers Ranking Data From Backend
    fetchClassRankingData(nextProps) {
        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        apiCall.get(`/getMovement/${nextProps.SemesterID}`,(err, response, body) => {
            console.log('Testing Again Bro '+ body.students[0].UpdateDate);
            this.setState({
                topMovers: body.students,//Ranking of the studens
                topMoversPointMovement: body.students[0].PointsMovement,//Points of the current student
                topMoversUpdateDate: body.students[0].UpdateDate//Last Updated date
            });
        });
    }

    //Will Render Data
    componentWillMount(){
        this.fetchClassRankingData(this.props);
    };
    //If the data is changed without reloading the page then this function will take place
    componentWillReceiveProps(nextProps){
        this.fetchClassRankingData(nextProps);
    };

    render(){

        //Render the data by formatting it
        let topMovers = this.state.topMovers.map(klassRank => {
            return <div className="topMoversRanks" id={`topMoversTop${klassRank.Rank}`}>
                <div id="topMoversNameAndPointContainer">
                    <h2 className="topMoversStudentNames">{klassRank.Rank}. {klassRank.FirstName} {klassRank.LastName}</h2>
                    <div className="topMoversPoints">{klassRank.TotalPoints} points</div>
                    <p className="topMoversPointsAdded">({klassRank.PointsMovement})</p>
                </div>
                <div className="topMoversImageContainer" id={`topMoversImage${klassRank.Rank}`}>
                    <img className="topMoversAvatars" src={`static/${klassRank.ProfilePicture}`} />
                </div>
                <div className="topMoversClearingDiv"></div>
            </div>;
        });

        //Students points, Last Updated, and Rank of students will be displayed here
        return (
            <div className="section card-2">
                <h2 id="topMoverTitle" className="title">Weekly Top Movers
                    <div id="TopMoversToolTip"><Tooltip Text="This section display the ranking movement differences for the week." ID="TopMoversToolTip" /></div>
                </h2>
                <div id="topMoversStudentPointArea"><p>Your Rank Movement: {this.state.topMoversPointMovement}</p></div>
                <div id="topMoversStudentList">
                    {topMovers}


                </div>
                <p id="topMoversLastUpdated">Last Updated: {this.state.topMoversUpdateDate}</p>

            </div>

        );
    }
}


export default TopMovers;