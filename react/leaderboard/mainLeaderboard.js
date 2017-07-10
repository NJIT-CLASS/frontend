/**
 * Created by Sohail and Immanuel on 7/7/2017.
 */

import React from 'react';
import ClassRanking from './classRanking';
import TopMovers from './topMovers';
import VsSections from './vsSections';


class MainLeaderboard extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }
    render(){
        return (

            <div className="container">
                    <div id="classRanking">
                        <ClassRanking />
                    </div>

                    <div id = "topMovers">
                        <TopMovers />
                    </div>

                    <div id = "vsSections">
                        <VsSections />
                    </div>

            </div>
        );
    }
}


export default MainLeaderboard;