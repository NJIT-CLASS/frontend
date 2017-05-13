import React from 'react';
import PropTypes from 'prop-types';

import { TASK_TYPES , TASK_TYPES_TEXT } from '../../server/utils/constants';

class SubTasksSidebarContainer extends React.Component {
    render() {
        let subtasks = this.props.task.subtasks.map((subtask, index) => {
            let classes = ['subtask'];

            if (index === this.props.currentTaskIndex) {
                classes.push('selected');
            }

            return (
                <div className={classes.join(' ')} key={index}>
                    {TASK_TYPES_TEXT[subtask.type]}
                </div>
            );
        });

        return (
            <div className="subtask-sidebar-container">
                <div className="previous-task">
                    <div onClick={this.props.returnToPreviousTask}>
                        <div className="super-title">Previous Task:</div>
                        <div>{TASK_TYPES_TEXT[this.props.task.type]}</div>
                    </div>
                    <i className="fa fa-angle-right"></i>
                </div>
                <div className="subtask-list">
                    { subtasks }
                </div>
            </div>
        );
    }
}

SubTasksSidebarContainer.propTypes = {
    task: PropTypes.object
};

export default SubTasksSidebarContainer;
