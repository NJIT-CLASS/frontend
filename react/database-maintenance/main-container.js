import React, { Component } from 'react';
import PropTypes from 'prop-types';

import apiCall from '../shared/apiCall';
import Select from 'react-select';
import strings from './strings';
import Tooltip from '../shared/tooltip';

import AssignmentInstanceContainer from './assignment-instance/assignmentInstanceContainer';
import AssignmentActivityContainer from './assignment-activity/assignmentActivityContainer';
    
class DatabaseMaintenanceContainer extends Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            Strings: strings,
            categories: [{
                value: 'assignment-activity',
                label: 'Assignment Activity'
            }, {
                value: 'assignment-instance',
                label: 'Assignment Instance'
            }],
            selectedCategory: null
        };
    }
    
    changeCategory(selectedCategory) {
        this.setState({ selectedCategory: selectedCategory.value });
    }

    render() { 
        let { Strings, selectedCategory } = this.state;

        let categoryContainer;
        if (selectedCategory == 'assignment-activity') {
            categoryContainer = <AssignmentActivityContainer strings={Strings} />;
        } else if (selectedCategory == 'assignment-instance') {
            categoryContainer = <AssignmentInstanceContainer strings={Strings} />;
        }
        
        return <div>
            <div className="card">
                <h2 className="title">
                    {Strings.categoryPickerTitle}
                    <Tooltip Text={Strings.categoryPickerTootltip} />
                </h2>
                
                <div className="card-content">
                    <Select
                        options={this.state.categories}
                        value={selectedCategory}
                        onChange={this.changeCategory.bind(this)}
                        clearable={false}
                        searchable={false}
                    />
                </div>
            </div>
            {categoryContainer}
        </div>;
    }
}
         
export default DatabaseMaintenanceContainer;