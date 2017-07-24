/**
 * Created by Sohail and Immanuel on 7/7/2017.
 */
import React from 'react';
import request from 'request';
import Tooltip from '../shared/tooltip';


class VsSections extends React.Component {
    constructor(props){
        super(props);

        this.state = {vsSections: []};
    }

    /*    componentWillMount() {
     const fetchOptions = {
     method: 'GET',
     //'/api/{add the string or name that amoudo has made}
     uri: this.props.apiUrl + '/api/vsSections/' + this.props.UserID+ '/' +this.props.SemesterID,
     //qs: {SemesterID: this.props.SemesterID},
     json: true
     };

     //body will contain the information which will be passes and it is json
     //err will say if there is any error
     //response will be status
     request(fetchOptions,(err, response, body) => {
     console.log(body);
     this.setState({
     topMovers: body.courses
     //stuff we need from api
     //badges: body.badges//body.whatever we need from api
     })
     });

     }*/

    render(){

        let vsSectionsArray = [{Name: "Micheal", Points:1231, Avatar:"favicon.ico", PointsAdded:"-2", key: 1}, {Name: "Alan", Points:453, PointsAdded:"+7", Avatar:"favicon.ico",key: 2},
            {Name: "Jimmy", Points:1121, PointsAdded:"+2", Avatar:"favicon.ico",key: 3}, {Name: "Erick", Points:234, PointsAdded:"-12", Avatar:"favicon.ico",key: 4},
            {Name: "Romeo", Points:123, Avatar:"favicon.ico", PointsAdded:"2", key: 5}, {Name: "Juilet", Points:111, PointsAdded:"+7", Avatar:"favicon.ico",key: 6},
            {Name: "Poland", Points:101, PointsAdded:"+2", Avatar:"favicon.ico",key: 7}, {Name: "Spring", Points:100, PointsAdded:"-12", Avatar:"favicon.ico",key: 8}];
        let vsSections = vsSectionsArray.map(klassRank => {
            return <div className="vsSectionRanks" id={`vsSectionTop${klassRank.key}`}>
                <div id="vsSectionsNameAndPointContainer">
                    <h2 className="vsSectionStudentNames">{klassRank.key}. {klassRank.Name}</h2>
                    <div className="vsSectionPoints">{klassRank.Points} points</div>
                    <p className="vsSectionPointsAdded">({klassRank.PointsAdded})</p>
                </div>
                <div className="vsSectionImageContainer" id={`vsSectionsImage${klassRank.key}`}>
                    <img className="vsSectionAvatars" src={`static/${klassRank.Avatar}`} />
                </div>
                <div className="vsSectionClearingDiv"></div>
            </div>
        });

        return (

            <div className="section card-2">
                <h2 id="vsSectionsTitle" className="title">vs Sections
                    <div id="vsSectionToolTip"><Tooltip Text="This section displays how your class compares about others class in terms of points earned per class member." ID="csSectionToolTip" /></div>
                </h2>
                <div id="vsSectionsStudentPointArea"><p>Your Class Points: {this.props.Points}</p>
                    <p id="vsSectionStudentClassRank">Class Rank:  {this.state.Points}</p></div>

                <div id="vsSectionsStudentList">
                    {vsSections}
                </div>
                <p id="vsSectionsLastUpdated">Last Updated: </p>

            </div>

        );
    }
}


export default VsSections;