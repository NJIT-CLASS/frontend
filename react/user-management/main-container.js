import React, {Component} from 'react';
import apiCall from '../shared/apiCall';
import ToggleSwitch from '../shared/toggleSwitch';
import strings from './strings';
import ReactTable from 'react-table';
import Select from 'react-select';

class UserManagementContainer extends Component{

    constructor(props){
        super(props);

        this.componentData = {
            instructorList: [],
            users:[],
            blockedNotification:null,
            removeNotification:null,
            addInstructorNotification:null,
            passwordResetNotification:null
        }

        this.state = {
            instructorEmail: '',
            loaded: false
        };
    }

    componentDidMount(){
        this.fetchUsers();
    }

    fetchUsers(){
        apiCall.getAsync('/usermanagement',{}).then(body => {
            this.componentData.users = body.data.Assignments;
            this.setState({loaded:true});
        });
    }

    changeBlockedStatus(userID, email, isBlocked){
        var endpoint = '';

        if(isBlocked){
            endpoint = '/usermanagement/unblocked/';
        } else {
            endpoint = '/usermanagement/blocked/';
        }

        apiCall.getAsync(endpoint+userID,{}).then(body => {
            if(body.status === 200){
                this.componentData.blockedStatus = true;
                if(isBlocked){
                    this.componentData.blockedNotification = this.notification("success form-success", email+strings.unblockedSuccess);
                } else {
                    this.componentData.blockedNotification = this.notification("success form-success", email+strings.blockedSucess);
                }
            } else {   
                this.componentData.blockedStatus = false;
                if(isBlocked){
                    this.componentData.blockedNotification = this.notification("error form-error", email+strings.unblockedFailure);
                } else {
                    this.componentData.blockedNotification = this.notification("error form-error", email+strings.blockedFailure);
                }                       
            }
            this.fetchUsers();
        });
    }

    resetPassword(email){
        console.log(email);

        apiCall.post('/password/reset',(err,status,body)=>{
            if(status.statusCode === 200){
                this.componentData.passwordResetNotification = this.notification("success form-success", email+strings.pwResetSuccess);
            } else {
                this.componentData.passwordResetNotification = this.notification("error form-error", email+strings.pwResetFailure);
            }
            this.forceUpdate();
        });
    }

    removeUser(userID, email){
        console.log(userID);

        apiCall.delete(`/delete/user/${userID}`,{},(err, status, body) =>{
            if(status.statusCode === 200){
                this.componentData.removeNotification = this.notification("success form-success",email+strings.removeSuccess);
            } else {
                this.componentData.removeNotification = this.notification("error form-error",email+strings.removeFailure);
            }
            this.fetchUsers();
        });
    }

    changeRole(){

    }

    onChangeInstructorEmail(email){
        this.setState({ instructorEmail : email.target.value });
    }

    onSubmitEmail(){
        apiCall.put('/instructor/new', {email: this.state.instructorEmail}, (err, status, body) => {
            if(status.statusCode === 200){
                this.componentData.addInstructorNotification = this.notification("success form-success",strings.instructorAddedSuccess);
            } else {
                this.componentData.addInstructorNotification = this.notification("error form-error", strings.instructorAddedFailure);
            }
            this.forceUpdate();
        });
    }

    notification(classType, message){
        return (
            <div className={classType} role="alert">
                <i className="fa fa-exclamation-circle"></i>
                {message}
            </div>
        );
    }

    render(){
        let instructors = this.componentData.instructorList;
        let users = this.componentData.users;
        let blockedNotification = this.componentData.blockedNotification;
        let removeNotification = this.componentData.removeNotification;
        let resetPasswordNotification = this.componentData.passwordResetNotification;
        let addInstructorResultView = this.componentData.addInstructorNotification;
        let tableData = null;
        let status = null;

        if(!this.state.loaded){
            return (
                <div className="placeholder center-spinner">
                    <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
                </div>
            );
        }

        // Forming rows for the user management table =====================================================
        tableData = users.map(user=>{
            console.log(user);
            var organizationGroup = user.OrganizationGroup;
            var isBlocked = user.UserLogin.Blocked;
            var timeout = user.UserLogin.Timeout;
            var userID = user.UserID;
            var email = user.UserContact.Email;

            var selectOptions = [{value:"Admin", label:strings.admin},{value:"Instructor",label:strings.instructor},{value:"Admin & Instructor",label:strings.admin+" & "+strings.instructor},{value:"Student",label:strings.student},{value:"Unknown",label:strings.unknown}];
            
            var initialValue = "";
            if(user.Admin && user.Instructor){ initialValue = "Admin & Instructor"; } 
            else if(user.Admin){ initialValue = "Admin";}
            else if(user.Instructor){initialValue = "Instructor";}
            else {initialValue="Unknown";}

            if(organizationGroup === null){
                organizationGroup = "N/A";
            }

            if(timeout === null){
                timeout = "-";
            }

            return {
                email: email,
                firstName: user.FirstName,
                lastName: user.LastName,
                organization: organizationGroup,
                systemRole:(<Select clearable={false} searchable={false} value={initialValue} options={selectOptions}/>),
                blockedStatus: (<ToggleSwitch isClicked={isBlocked} click={this.changeBlockedStatus.bind(this, userID, email, isBlocked)} />),
                resetPassword: (<button type='button' onClick={this.resetPassword.bind(this, email)}>Reset</button>),
                removeUser: (<button type='button' onClick={this.removeUser.bind(this, userID, email)}>Remove</button>),
                timeoutStatus:timeout
            };
        });
        //===================================================================================================

        // Checking status for various operations and displays appropriate notifications ====================

        // Display status of blocked operation
        if(blockedNotification){
            status = blockedNotification;
            this.componentData.blockedNotification = null;
        }

        // Display status of remove notification
        if(removeNotification){
            status = removeNotification;
            this.componentData.removeNotification = null;
        }

        if(resetPasswordNotification){
            status = resetPasswordNotification;
            this.componentData.resetPasswordNotification = null;
        }

        // Display status of add instructor operation
        if(addInstructorResultView){
            this.componentData.addInstructorNotification = null;
        }
        //=================================================================================================

        // Total content returned
        return ( 
            <div>
                <form name="form_addInstructor" role="form" className="section" method="POST">
                        <h2 className="title">{strings.titleAddNewInstructor}</h2>
                        <div className="section-content" >

                            {addInstructorResultView}

                            <label>{strings.labelInstructorEmailAddress}:</label>
                            <input type="text"
                                name="instructorEmailInput"
                                onChange={this.onChangeInstructorEmail.bind(this)}
                                className="" />
                            <button type="button" 
                                name="submit"
                                onClick={this.onSubmitEmail.bind(this)}
                                className=""
                                > {strings.submit} </button>
                        </div>
                </form>

                <form name="user_management_table" role="form" className="section" method="post">
                    <div className="section-content">
                        <h2 className="title">Manage Users</h2>

                        {status}

                        <ReactTable
                        defaultPageSize={10}
                        className="-striped -highlight"
                        resizable={true}
                        data={tableData}
                        columns={[
                        {
                        Header: strings.email,
                        accessor: 'email',
                        },
                        {
                        Header: strings.fn,
                        accessor: 'firstName',
                        },
                        {
                        Header: strings.ln,
                        accessor: 'lastName'
                        },
                        {
                        Header: strings.organization,
                        accessor: 'organization',
                        },
                        {
                        Header: strings.sysRole,
                        accessor: 'systemRole',
                        },
                        {
                        Header: strings.testUser,
                        accessor: 'testUser',
                        },
                        {
                        Header: strings.blocked,
                        accessor: 'blockedStatus',
                        },
                        {
                        Header: strings.lastLogin,
                        accessor: 'lastLogin',
                        },
                        {
                        Header: strings.timeout,
                        accessor: 'timeoutStatus',
                        },
                        {
                        Header: strings.resetPW,
                        accessor: 'resetPassword',
                        },
                        {
                        Header: strings.removeUser,
                        accessor: 'removeUser',
                        },
                        ]} 
                        noDataText={strings.noUsers}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default UserManagementContainer;