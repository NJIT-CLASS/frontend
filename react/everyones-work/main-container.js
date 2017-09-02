import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import Collapsible from 'react-collapsible';
import ListItemComponent from './listItemComponent';



class EveryonesWorkMain extends Component {
    constructor(props){
        super(props);
        this.state = {
            ListOfWorkflows: {},
            Loaded: false
        };
    }
    componentWillMount () {
        this.fetchIDs(this.props);
    }
    
    fetchIDs(props){
        apiCall.get(`/EveryonesWork/AssignmentInstanceID/${props.AssignmentID}`, (err, res, body) => {
            console.log(body);
            this.setState({
                ListOfWorkflows: body.Workflows,
                AssignmentInfo: body.AssignmentInfo,
                Loaded: true
            });
        });
    }
    render() {
        let {Loaded, ListOfWorkflows, AssignmentInfo} = this.state;
        let {UserID} = this.props;
        if(!Loaded){
            return <div></div>;
        }
        let listofWorkflows = Object.keys(ListOfWorkflows).map(workflowActivityId => {
            const listOfTasks = ListOfWorkflows[workflowActivityId].Tasks.map( (taskObject, index) =>
                <ListItemComponent key={workflowActivityId + ' ' + index} TaskObject={taskObject} 
                    UserID={UserID}/>
            );
        
            let titleText = AssignmentInfo.Name;//ListOfWorkflows[workflowActivityId].Name;
            return ( 
                <div className="section" key={`${workflowActivityId}`}>
                    <div className="title">{`${titleText}`}</div>
                    <div className="section-content">
                        <span>{AssignmentInfo.Instructions}</span>
                        {listOfTasks}
                    </div>
                </div>
            );
        });
        return (
            <div>
                { listofWorkflows}
            </div>
    
        );
    }
}

export default EveryonesWorkMain;