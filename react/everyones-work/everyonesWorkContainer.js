import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import Collapsible from 'react-collapsible';
import ListItemComponent from './listItemComponent';



class EveryonesWorkContainer extends Component {
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
    componentWillReceiveProps (nextProps) {
        this.fetchIDs(nextProps);
    }
    
    fetchIDs(props){
        apiCall.get(`/EveryonesWork/AssignmentInstanceID/${props.AssignmentID}`, (err, res, body) => {
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
        const listofWorkflows = Object.keys(ListOfWorkflows).map((workflowActivityId, workflowIndex) => {
            const listOfTasks = ListOfWorkflows[workflowActivityId].Tasks.map( (taskObject, index) =>
                <ListItemComponent
                    key={workflowActivityId + ' ' + index}
                    TaskObject={taskObject} 
                    UserID={UserID}
                    selectWorkflow={this.props.selectWorkflow}
                />
            );
        
            let titleText = AssignmentInfo.Name == null ? '': `${AssignmentInfo.Name} -`;
            if(ListOfWorkflows[workflowActivityId].Name != ''){
                if(ListOfWorkflows[workflowActivityId].Name === 'Problem'){
                    titleText = `${titleText}  
                    ${ListOfWorkflows[workflowActivityId].Name} ${(workflowIndex + 1)}`;
                } 
                else {
                    titleText = ListOfWorkflows[workflowActivityId].Name;
                }
            } 
            

            return ( 
                <div className="section" key={`${workflowActivityId}`}>
                    <div className="title">{`${titleText}`}</div>
                    <div className="section-content">
                        <div>
                            <b>
                                {AssignmentInfo.Course} - {AssignmentInfo.Section} - {AssignmentInfo.Semester}
                            </b>
                            <span>{AssignmentInfo.Instructions}</span>
                        </div>
                        

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

export default EveryonesWorkContainer;