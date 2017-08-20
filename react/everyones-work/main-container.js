import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import Collapsible from 'react-collapsible';

class EveryonesWorkMain extends Component {
    constructor(props){
        super(props);
        this.state = {
            ListofEveryone: {},
            Loaded: false
        };
    }
    componentWillMount () {
        this.fetchIDs(this.props);
    }
    
    fetchIDs(props){
        apiCall.get(`/EveryonesWork/${props.AssignmentID}`, (err, res, body) => {
            console.log(body);
            this.setState({
                ListofEveryone: body.EveryonesWork,
                Loaded: true
            });
        });
    }
    render() {
        let {Loaded, ListofEveryone} = this.state;
        if(!Loaded){
            return <div></div>;
        }
        let listofUsers = Object.keys(ListofEveryone).map(userId => {
            const listOfTasks = ListofEveryone[userId].map( taskId =>
                <li><a href={`/task/${taskId}`}>{taskId}</a></li>
            );
            
            return ( 
                <Collapsible trigger={`${userId}`}>
                    {listOfTasks}
                </Collapsible>
            );
        });
        return (
            <div>
                { listofUsers}
            </div>
    
        );
    }
}

export default EveryonesWorkMain;