import React, { Component } from 'react';
import Modal from '../shared/modal';

// function to convert given miliseconds into hours, mintues, seconds
// returns an object {hours, minutes, seconds}
const covertToHMS = (time) => {
    let hours = Math.floor(time/3600);
    time = time%3600;
    let minutes = Math.floor(time/60);
    time = time%60; 
    let seconds = Math.floor(time);
    return [hours, minutes, seconds]
}


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

    // TODO //

    // due date, default duration since triggered, actual date submitted (or cancelled/bypassed), who completed the task
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

    timeLine(){
        let {StartDate, EndDate, ActualEndDate } = this.props.taskInstance;
        let submitted = ActualEndDate !== null
        StartDate = new Date(StartDate)
        EndDate = new Date(EndDate)
        ActualEndDate = new Date(ActualEndDate)
        let timeLapesedInMilliSecs = Date.now() - StartDate;
        const [hrs, mins, secs] = covertToHMS(timeLapesedInMilliSecs/1000);
        
        const bold = {fontWeight: "700"}
        
    let timeLapesedString = (<span>{hrs}&nbsp;<span style={bold}>hrs-</span>{mins}&nbsp;<span style={bold}>mins-</span>{secs}&nbsp;<span style={bold}>secs</span></span> )
        let tableBody = null


        const [execution, cancelled, revision, dueStatus, pageInteraction, reallocation ] = JSON.parse(this.props.taskInstance.Status)
        switch(execution){
            case "complete":
                tableBody = (
                    <tbody>
                        <tr>
                            <th>Time Elapsed:</th> <td>{timeLapesedString}</td>
                        </tr>
                        <tr>
                            <th>Started At:</th> <td>{StartDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submission Deadline:</th> <td>{EndDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>{cancelled!=="normal" ? "Cancelled At" : "Submitted At"}:</th> <td>{ActualEndDate.toUTCString()}</td>
                        </tr>
                    </tbody>
                )
                break
            case "not_yet_started":
                if(cancelled!=="cancelled"){
                    tableBody = (
                        <tbody>
                            <tr>
                                <th>Time Elapsed:</th> <td>Not Started...</td>
                            </tr>
                            <tr>
                                <th>Started At:</th> <td>Not Started...</td>
                            </tr>
                            <tr>
                                <th>Submission Deadline:</th> <td>Not Started...</td>
                            </tr>
                            <tr>
                                <th>Submitted At:</th> <td>Not Started...</td>
                            </tr>
                        </tbody>   
                    )
                }else{
                    tableBody = (
                        <tbody>
                            <tr>
                                <th>Time Elapsed:</th> <td>Cancelled...</td>
                            </tr>
                            <tr>
                                <th>Started At:</th> <td>Cancelled...</td>
                            </tr>
                            <tr>
                                <th>Submission Deadline:</th> <td>Cancelled...</td>
                            </tr>
                            <tr>
                                <th>Cancelled At:</th> <td>{ActualEndDate.toUTCString()}</td>
                            </tr>
                        </tbody>   
                    )
                }
                
                break
            case "started":
                tableBody = (
                    <tbody>
                        <tr>
                            <th>Time Elapsed:</th> <td>{timeLapesedString}</td>
                        </tr>
                        <tr>
                            <th>Started At:</th> <td>{StartDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submission Deadline:</th> <td>{EndDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submitted At:</th> <td>{!submitted ? "Not Submitted": ActualEndDate.toUTCString()}</td>
                        </tr>
                    </tbody> 
                )
                break
            case "bypassed":
                tableBody = (
                    <tbody>
                        <tr>
                            <th>Time Elapsed:</th> <td>Bypassed</td>
                        </tr>
                        <tr>
                            <th>Started At:</th> <td>{StartDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submission Deadline:</th> <td>{EndDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Bypassed At:</th> <td>{ActualEndDate.toUTCString()}</td>
                        </tr>
                    </tbody> 
                )
                break
            case "automatic":
                tableBody = (
                    <tbody>
                        <tr>
                            <th>Time Elapsed:</th> <td>Automatic</td>
                        </tr>
                        <tr>
                            <th>Start At:</th> <td>{StartDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submit By:</th> <td>{EndDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submitted At:</th> <td>{ActualEndDate.toUTCString()}</td>
                        </tr>
                    </tbody>
                )
                break
        }

        return (
            <div>
                <h1>Time-Line</h1>
                <table className="more-information">
                    {tableBody}
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
        currentUser = { ...currentUser, email: currentUserEmail, fullName: `${this.props.taskInstance.User.FirstName} ${this.props.taskInstance.User.LastName}`  };

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
                {this.timeLine()}
                <hr />
                {this.statusTable()}
                <hr /> 

                <p> Currently assigned to: {currentUser.email} (User ID: {currentUser.user_id}) </p>
                <p> For extra credit: {currentUser.is_extra_credit ? 'yes' : 'no'} </p>
                <br />
                {this.userHistoryTable(prevUsers)}
                <br/>
                {JSON.parse(this.props.taskInstance.Status)[0] === "complete" ? (
                    <p><span style={{fontWeight: "700"}}>Completed By:</span> {currentUser.fullName} (User ID: {currentUser.user_id}) </p>
                ): null}
                


            </Modal>
        );
    }
}

export default MoreInformation;
