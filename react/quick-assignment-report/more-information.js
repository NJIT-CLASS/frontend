import React, { Component } from 'react';
import Modal from '../shared/modal';

// This component renders a modal panel which displays information about a task instance (passed in as a prop).
class MoreInformation extends Component {
    constructor(props) {
        super(props);
    }

    userHistoryTable(prevUsers) {
        // Returns a table of all of this task's previously assigned users
        const thead = (
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>For Extra Credit</th>
                    <th>Date Assigned</th>
                </tr>
            </thead>
        );

        const rows = prevUsers.reverse().map((prevUser, index) => {
            const extraCredit = prevUser.is_extra_credit;
            let allocatonDate = new Date(prevUser.time);
            allocatonDate = allocatonDate.toDateString() + ' ' + allocatonDate.toTimeString().split(' ')[0];
            const user = this.props.sectionInfo.users.find(user => user.id === prevUser.user_id);
            if(user == undefined || user == null){
                return <tr>
                    <td></td>    
                    <td></td>    
                    <td></td>    
                    <td></td>    
                </tr>;
            }
            return (
                <tr key={index}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{extraCredit ? 'yes' : 'no'}</td>
                    <td>{allocatonDate}</td>
                </tr>
            );
        });

        return (
            <div>
                <h1>User History</h1>
                {rows.length > 0 ? (
                    <table className="more-information">
                        {thead}
                        <tbody>{rows}</tbody>
                    </table>
                ) : 'No previously assigned users'}
            </div>
        );
    }

    statusTable() {
        // Returns a table displaying all of this task's statuses.

        const taskInstanceStatuses = JSON.parse(this.props.taskInstance.Status);
        const statusLabels = [
            'Execution',
            'Cancelled',
            'Revision',
            'Due Status',
            'Page Interaction',
            'Reallocation'
        ];
        const rows = statusLabels.map((label, index) => (
            <tr key={index}>
                <th>{label}:</th> <td>{taskInstanceStatuses[index]}</td>
            </tr>
        ));

        return (
            <div>
                <h1>Status</h1>
                <table className="more-information">
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }

    render() {
        const prevUsers = JSON.parse(this.props.taskInstance.UserHistory);

        // Remove the currently assigned user from the list of previous users.
        // The current user will be displayed separately.
        let currentUser = prevUsers.pop();

        // Merge in the current user's email address since we want to display that too.
        const users = this.props.sectionInfo.users;
        var currentUserID = this.props.taskInstance.User.UserID;
        var currentUserData = users.find(user => user.id === currentUser.user_id);
        var currentUserEmail = null;
        if(currentUserData == null || currentUserData.length == 0){
            currentUserData =  users.find(user => user.id === currentUserID);
        }
        currentUserEmail = currentUserData.email;
        currentUser = { ...currentUser, email: currentUserEmail };

        const taskInstanceID = this.props.taskInstance.TaskInstanceID;
        const taskName = this.props.taskInstance.TaskActivity.DisplayName;
        const assignmentName = this.props.sectionInfo.assignmentName;
        return (
            <Modal
                title="More Information"
                close={this.props.onClose}
                width={'680px'}
                outsideClick={true}
            >
                <table className="more-information">
                    <tbody>
                        <tr><th>Task Display Name:</th><td>{taskName}</td></tr>
                        <tr><th>Task Instance ID:</th><td>{taskInstanceID}</td></tr>
                        <tr><th>Assignment Display Name:</th><td>{assignmentName}</td></tr>
                    </tbody>
                </table>
                <hr />

                {this.statusTable()}
                <hr /> 

                <p> Currently assigned to: {currentUser.email} (User ID: {currentUser.user_id}) </p>
                <p> For extra credit: {currentUser.is_extra_credit ? 'yes' : 'no'} </p>
                <br />
                {this.userHistoryTable(prevUsers)}

            </Modal>
        );
    }
}

export default MoreInformation;
