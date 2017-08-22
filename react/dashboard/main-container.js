import React, { Component } from 'react';
import CompletedTaskComponent from './completedTasksComponent';
import PendingTaskComponent from './pendingTasksComponent';
import CoursesComponent from './coursesComponent';
import strings from './strings';

class DashboardMain extends Component {
    constructor(props){
        super(props);

        this.state = {
            Notifications:[],
            Strings: strings
        };



    }

    componentWillMount (){
        this.props.__(strings, (newStrings) => {
            this.setState({Strings: newStrings});
        });
    }
    

    render(){
        let {Strings} = this.state;
        return <div>
            <div id="left-half">
                <CoursesComponent Strings={Strings} UserID={this.props.UserID}/>

            </div>
            <div id="right-half">
                <PendingTaskComponent Strings={Strings} UserID={this.props.UserID}/>
                <CompletedTaskComponent Strings={Strings} UserID={this.props.UserID}/>
            </div>
            
        </div>;
    }
}

export default DashboardMain;