import React, {Component} from 'react';
import apiCall from '../shared/apiCall';

class UserManagementContainer extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        let strings = {
            Hello: 'hello'
        };

        return ( 
            <div>
                {strings.Hello}
            </div>);
    }
}

export default UserManagementContainer;