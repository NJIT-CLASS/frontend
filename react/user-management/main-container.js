import React, {Component} from 'react';
import apiCall from '../shared/apiCall';
import strings from './strings';

class UserManagementContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            Strings: strings
        };
    }

    componentDidMount() {
        //handles translating the strings
        this.props.__(strings, newStrings => {
            this.setState({
                Strings: newStrings
            });
        });
    }
    render(){
        let {Strings} = this.state;

        return ( 
            <div>
                {Strings.Hello}
            </div>);
    }
}

export default UserManagementContainer;