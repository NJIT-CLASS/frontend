import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';

import Assignments from './assignments';
import ArchivedAssignments from './archivedAssignments';
import strings from './strings';
    
class DatabaseMaintenanceContainer extends Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            Strings: strings
        };
    }
    
    render() { 
        let {Strings} = this.state;
        
        return (
            <div class="container">
                <div class="col-xs-6">
                    <Assignments strings={this.state.Strings} />
                </div>
                <div class="col-xs-6">
                    <ArchivedAssignments strings={this.state.Strings} />
                </div>
            </div>
        );
    }
}
         
export default DatabaseMaintenanceContainer;
    