import React, { Component } from 'react';
import CompletedTaskComponent from './completedTasksComponent';
import PendingTaskComponent from './pendingTasksComponent';
import CoursesComponent from './coursesComponent';
import strings from './strings';

class DashboardMain extends Component {
    constructor(props){
        super(props);

        this.state = {
            Notifications:[]
        };

    }

    render(){
        return <div>
            <div id="left-half">
                <CoursesComponent Strings={strings} UserID={this.props.UserID}/>

            </div>
            <div id="right-half">
                <PendingTaskComponent Strings={strings} UserID={this.props.UserID}/>
                <CompletedTaskComponent Strings={strings} UserID={this.props.UserID}/>
            </div>
            
        </div>;
    }
}

export default DashboardMain;