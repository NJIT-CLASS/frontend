import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';
    
class DatabaseMaintenanceContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            Strings: {
                HelloString: 'Hello'
            }
        };
    }
    render() { 
        let {Strings} = this.state;
        return (<div>{Strings.HelloString}</div> );
    }
}
         
export default DatabaseMaintenanceContainer;;
    