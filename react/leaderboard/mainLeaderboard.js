/**
 * Created by Sohail and Immanuel on 7/7/2017.
 */

import React from 'react';
import ClassRanking from './classRanking';
import TopMovers from './topMovers';
import VsSections from './vsSections';
import request from 'request';


class MainLeaderboard extends React.Component {
    constructor(props){
        super(props);
    }

  
    render(){
        return (
            
            <div className="container">
                    <div id="classRanking">
                        <ClassRanking apiUrl={this.props.apiUrl}
                                      UserID={this.props.UserID}
                        />
                    </div>

                    <div id = "topMovers">
                        <TopMovers />
                    </div>

                    <div id = "vsSections">
                        <VsSections apiUrl={this.props.apiUrl}
                                    UserID={this.props.UserID}
                        />
                    </div>

            </div>
        );
    }
}


export default MainLeaderboard;