/**
 * Created by Sohail and Immanuel on 7/7/2017.
 */
import React from 'react';
import request from 'request';
import Tooltip from '../shared/tooltip';


class TopMovers extends React.Component {
    constructor(props){
        super(props);

        this.state = {topMovers: []};
    }

    /*    componentWillMount() {
     const fetchOptions = {
     method: 'GET',
     //'/api/{add the string or name that amoudo has made}
     uri: this.props.apiUrl + '/api/topMovers/' + this.props.UserID+ '/' +this.props.SemesterID,
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

        let topMoversArray = [{Name: "Jimmy", Points:1231, Avatar:"favicon.ico", PointsAdded:"-2", key: 1}, {Name: "Erick", Points:453, PointsAdded:"+7", Avatar:"favicon.ico",key: 2},
            {Name: "Alan", Points:1121, PointsAdded:"+2", Avatar:"favicon.ico",key: 3}, {Name: "Micheal", Points:234, PointsAdded:"-12", Avatar:"favicon.ico",key: 4},
            {Name: "Romeo", Points:123, Avatar:"favicon.ico", PointsAdded:"2", key: 5}, {Name: "Juilet", Points:111, PointsAdded:"+7", Avatar:"favicon.ico",key: 6},
            {Name: "Poland", Points:101, PointsAdded:"+2", Avatar:"favicon.ico",key: 7}, {Name: "Spring", Points:100, PointsAdded:"-12", Avatar:"favicon.ico",key: 8}];
        let topMovers = topMoversArray.map(klassRank => {
            return <div className="topMoversRanks" id={`topMoversTop${klassRank.key}`}>
                <div id="topMoversNameAndPointContainer">
                    <h2 className="topMoversStudentNames">{klassRank.key}. {klassRank.Name}</h2>
                    <div className="topMoversPoints">{klassRank.Points} points</div>
                    <p className="topMoversPointsAdded">({klassRank.PointsAdded})</p>
                </div>
                <div className="topMoversImageContainer" id={`topMoversImage${klassRank.key}`}>
                    <img className="topMoversAvatars" src={`static/${klassRank.Avatar}`} />
                </div>
                <div className="topMoversClearingDiv"></div>
            </div>
        });

        return (

            <div className="section card-2">
                <h2 id="topMoverTitle" className="title">Weekly Top Movers
                    <div id="TopMoversToolTip"><Tooltip Text="This section display the ranking movement differences for the week." ID="TopMoversToolTip" /></div>
                </h2>
                <div id="topMoversStudentPointArea"><p>Your Rank Movement: {this.props.Points}</p></div>
                <div id="topMoversStudentList">
                  {topMovers}


                </div>
                <p id="topMoversLastUpdated">Last Updated: </p>

            </div>

        );
    }
}


export default TopMovers;