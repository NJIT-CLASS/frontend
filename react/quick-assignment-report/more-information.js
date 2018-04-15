import React, { Component } from 'react';
import Modal from '../shared/modal';

class MoreInformation extends Component {
    constructor(props) {
        super(props);
    }

    userHistoryTable(prevUsers) {
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
        const taskInstanceStatus = JSON.parse(this.props.taskInstance.Status);
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
                <th>{label}:</th>
                <td>{taskInstanceStatus[index]}</td>
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
        let currentUser = prevUsers.pop();

        const users = this.props.sectionInfo.users;
        currentUser = { ...currentUser, ...users.find(user => user.id === currentUser.user_id)};

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

                <p> Currently assigned to: {currentUser.email} (User ID: {currentUser.id}) </p>
                <p> For extra credit: {currentUser.is_extra_credit ? 'yes' : 'no'} </p>
                <br />
                {this.userHistoryTable(prevUsers)}

            </Modal>
        );
    }
}

export default MoreInformation;
