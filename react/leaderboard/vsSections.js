/**
 * Created by Sohail on 7/7/2017.
 * This File will display ranking between different sections and courses for the semester
 */
import React from 'react';
import apiCall from '../shared/apiCall';
import Tooltip from '../shared/tooltip';


class VsSections extends React.Component {
    constructor(props){
        super(props);
        this.state = {vsSection: []};
    }

    //Fetch Section Ranking Data From Backend
    fetchClassRankingData(nextProps) {
        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        apiCall.get(`/getSectionsRanking/${nextProps.SemesterID}`,(err, response, body) => {
            console.log('Testing Again Bro '+ body.students);
            this.setState({
                vsSection: body.sections,//Section Ranking Data
                vsSectionUpdateDate: body.sections[0].UpdateDate//Last Updated Date
            });
        });
    }

    //Will render data
    componentWillMount(){
        this.fetchClassRankingData(this.props);
    };
    //If the data is changed without reloading the page then this function will take place
    componentWillReceiveProps(nextProps){
        this.fetchClassRankingData(nextProps);
    };

    //Will render the section ranking data in a good format
    render(){

        let vsSections = this.state.vsSection.map(klassRank => {
            return <div className="vsSectionRanks" id={`vsSectionTop${klassRank.Rank}`}>
                <div id="vsSectionsNameAndPointContainer">
                    <h2 className="vsSectionStudentNames">{klassRank.Rank}. {klassRank.CourseNumber} {klassRank.SectionName}</h2>
                    <div className="vsSectionPoints">{klassRank.AveragePoints} points</div>
                    <p className="vsSectionPointsAdded">({klassRank.Rank})</p>
                </div>
                <div className="vsSectionImageContainer" id={`vsSectionsImage${klassRank.Rank}`}>
                    <img className="vsSectionAvatars" src={`static/${klassRank.ProfilePicture}`} />
                </div>
                <div className="vsSectionClearingDiv"></div>
            </div>;
        });

        //Items returned to screen
        return (

            <div className="section card-2">
                <h2 id="vsSectionsTitle" className="title">vs Sections
                    <div id="vsSectionToolTip"><Tooltip Text="This section displays how your class compares about others class in terms of points earned per class member." ID="csSectionToolTip" /></div>
                </h2>
                <div id="vsSectionsStudentPointArea"><p>Your Class Points: </p>
                    <p id="vsSectionStudentClassRank">Class Rank:  </p></div>

                <div id="vsSectionsStudentList">
                    {vsSections}
                </div>
                <p id="vsSectionsLastUpdated">Last Updated: {this.state.vsSectionUpdateDate}</p>

            </div>

        );
    }
}


export default VsSections;