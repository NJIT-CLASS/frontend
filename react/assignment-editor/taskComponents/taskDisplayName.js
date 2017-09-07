import React, { Component } from 'react';
import Tooltip from '../../shared/tooltip';

class TaskDisplayName extends Component {

    constructor(props) {
        super(props);
    
        this.changeInput = this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_display_name', this.props.index, this.props.workflowIndex);
    }
    
    render() {
        let {strings, workflowIndex, index, value} = this.props;
        return (
            <div className="inner">
                <label>{strings.DisplayName}</label>
                <Tooltip Text={strings.TaskDisplayNameMessage} ID={`w${workflowIndex}-T${index}-display-name-tooltip`} />
                <br />
                <input type="text" placeholder={strings.DisplayName} value={value} onChange={this.changeInput} /><br />
            </div>
        );
    }
}

export default TaskDisplayName;