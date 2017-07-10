/**
 * Created by Sohail and Immanuel on 7/7/2017.
 */
import React from 'react';
import request from 'request';

class ClassRanking extends React.Component {
    constructor(props){
        super(props);


        this.state = {classRanking: []};
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
        let classListArray = [{Name: "Alan the One", Points:1231, Avatar:"favicon.ico", PointsAdded:"-2", key: 1}, {Name: "The Alan", Points:453, PointsAdded:"+7", Avatar:"favicon.ico",key: 2},
            {Name: "Great Alan", Points:1121, PointsAdded:"+2", Avatar:"favicon.ico",key: 3}, {Name: "Only Alan", Points:234, PointsAdded:"-12", Avatar:"favicon.ico",key: 4}];
        let classRankingList = classListArray.map(klassRank => {
            return <div className="leaderBoardRanks" id={`leaderBoardTop${klassRank.key}`}>
                <div>
                    <h2 className="leaderBoardStudentNames">{klassRank.Name}</h2>
                    <img className="leaderBoardAvatars" src={`static/${klassRank.Avatar}`} />
                </div>
                <div className="leaderBoardMiddleClearingDiv"></div>
                <div className="leaderboardPointsContainer">
                    <div className="leaderBoardPoints">{klassRank.Points} points</div>
                    <p className="leaderBoardPointsAdded">({klassRank.PointsAdded})</p>
                </div>
                <div className="leaderBoardClearingDiv"></div>
            </div>
            });

        return (

            <div className="section card-2">
                <h2 id="classRankingTitle" className="title">Class Ranking</h2>
                    {classRankingList}
            </div>

        );
    }
}


export default ClassRanking;