/**
 * Created by Sohail and Immanuel on 7/7/2017.
 */
import React from 'react';
import request from 'request';
import Tooltip from '../shared/tooltip';

class ClassRanking extends React.Component {
    constructor(props){
        super(props);
        this.state = {classRanking: []};
    }

    fetchClassRankingData() {
        const fetchOptionsForClassRanking = {
            method: 'GET',
            //'/api/{add the string or name that amoudo has made}
            //uri: this.props.apiUrl + '/api/sectionUsers/'  +this.props.SemesterID + "/" + this.props.CourseID + "/" + this.props.SectionID +"/"+ this.props.UserID,
            uri: this.props.apiUrl + '/api/getSectionRanking/1/1/1/1',
            json: true
        };


        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        request(fetchOptionsForClassRanking,(err, response, body) => {
            console.log("Testing Again Bro "+ body);
            this.setState({
                classRanking: body.students,//body.whatever we need from api
                studentRank: body.currentStudent
            })
        });
    }

    componentWillMount(){
        this.fetchClassRankingData(this.props);
    }


    /*componentWillMount() {
     const fetchOptions = {
     method: 'GET',
     //'/api/{add the string or name that amoudo has made}
     uri: this.props.apiUrl + '/api/studentCourses/' + this.props.UserID+ '/' +this.props.SemesterID,
     //qs: {SemesterID: this.props.SemesterID},
     json: true
     };

     //body will contain the information which will be passes and it is json
     //err will say if there is any error
     //response will be status
     request(fetchOptions,(err, response, body) => {
     console.log(body);
     this.setState({
     classRanking: body.courses
     //stuff we need from api
     //badges: body.badges//body.whatever we need from api
     })
     });

     }*/

    render(){
        /*let classListArray = [{Name: "Alan", Points:1231, Avatar:"favicon.ico", PointsAdded:"-2", key: 1}, {Name: "Erick", Points:453, PointsAdded:"+7", Avatar:"favicon.ico",key: 2},
         {Name: "Micheal", Points:1121, PointsAdded:"+2", Avatar:"favicon.ico",key: 3}, {Name: "Jimmy", Points:234, PointsAdded:"-12", Avatar:"favicon.ico",key: 4},
         {Name: "Romeo", Points:123, Avatar:"favicon.ico", PointsAdded:"2", key: 5}, {Name: "Juilet", Points:111, PointsAdded:"+7", Avatar:"favicon.ico",key: 6},
         {Name: "Poland", Points:101, PointsAdded:"+2", Avatar:"favicon.ico",key: 7}, {Name: "Spring", Points:100, PointsAdded:"-12", Avatar:"favicon.ico",key: 8}];
         let classRankingList = classListArray.map(klassRank => {
         return <div className="classRankingRanks" id={`classRankingTop${klassRank.key}`}>
         <div id="classRankingNameAndPointContainer">
         <h2 className="classRankingStudentNames">{klassRank.key}. {klassRank.Name}</h2>
         <div className="classRankingPoints">{klassRank.Points} points</div>
         </div>
         <div className="classRankingImageContainer"  id={`classRankingImage${klassRank.key}`}>
         <img className="classRankingAvatars" src={`static/${klassRank.Avatar}`} />
         </div>
         <div className="classRankingClearingDiv"></div>
         </div>
         });*/

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
            </div>
        });

        return (

            <div className="section card-2">
                <h2 id="classRankingTitle" className="title" >Class Ranking
                    <div id="ClassRankingToolTip"><Tooltip Text="This section displays your class ranking based on the total number of points earned to date. Updated hourly or daily" ID="ClassRankingToolTip" /></div>
                </h2>
                <div id="classRankingStudentPointArea"><p>Your Points: 90</p></div>
                <div id="classRankingStudentList">
                    {classRankingList}
                </div>


                <p id="classRankingLastUpdated">Last Updated: </p>
            </div>

        );
    }
}


export default ClassRanking;