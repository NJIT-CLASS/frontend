import React, {Component} from 'react';
import apiCall from '../shared/apiCall';
import ToggleSwitch from '../shared/toggleSwitch';
import strings from './strings';
import ReactTable from 'react-table';
import Select from 'react-select';
var dateFormat = require('dateformat');

class UserManagementContainer extends Component{

    constructor(props){
        super(props);

        this.componentData = {
            instructorList: [],
            users:[],
            blockedNotification:null,
            removeNotification:null,
            passwordResetNotification:null,
            changeUserRoleNotification:null,
            addTestUserNotification:null,
            inviteAdminNotification:null
        }

        this.state = {
            addTestUserData:{
                selectValue:"",
                email:"",
                fn:"",
                ln:"",
                organization:"",
                access:"",
                pw:"",
                pwInputType:"password",
                hidePW:true,
            },
            addAdminUserData:{
                selectValue:"",
                email:"",
                fn:"",
                ln:"",
                organization:"",
                access:"",
                pw:"",
                pwInputType:"password",
                hidePW:true
            },
            changeUserRoleNotification:null,
            loaded: false
        };
    }

    componentDidMount(){
        this.fetchUsers();
    }

    fetchUsers(){
        apiCall.getAsync('/userManagement',{}).then(body => {
            this.componentData.users = body.data.Assignments;
            this.setState({loaded:true});
        });
    }

    changeBlockedStatus(userID, email, isBlocked){

        var endpoint = isBlocked ? '/userManagement/unblocked/' : '/userManagement/blocked/';

        apiCall.getAsync(endpoint+userID,{}).then(body => {
            if(body.status === 200){
                if(isBlocked){
                    this.componentData.blockedNotification = this.notification("success form-success", email+strings.unblockedSuccess);
                } else {
                    this.componentData.blockedNotification = this.notification("success form-success", email+strings.blockedSuccess);
                }
            } else {   
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

        apiCall.post('/password/reset',{email:email},(err,status,body)=>{
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

    changeRole(userID,name,oldRole,newRole){
        console.log(newRole,userID);
        apiCall.post('/usermanagement/role',{Role:newRole.value,UserID:userID},(err,status,body)=>{
            if(status.statusCode === 200){
                this.state.changeUserRoleNotification = this.notification("success form-success",name+": role changed from "+oldRole+" to "+newRole.value);
                this.fetchUsers();
            } else {
                this.state.changeUserRoleNotification = this.notification("error form-error",name+": Unable to change user role");
                this.forceUpdate();
            }   
        });
    }

    onFieldInput(form, field, input){
        this.state[form][field]=input.target.value;
        this.setState({form:this.state[form]});
    }

    createTestUser(){
        var testUserInfo = this.state.addTestUserData;
        var testRole = null;
        if(!testUserInfo.fn || !testUserInfo.ln || !testUserInfo.pw || !testUserInfo.access){
            this.componentData.addTestUserNotification = this.notification("error form-error","Fields marked with a * cannot be left blank");
            this.forceUpdate();
            return;
        }

        apiCall.post('/adduser',{email:testUserInfo.email,firstname:testUserInfo.fn,lastname:testUserInfo.ln,password:testUserInfo.pw,role:testUserInfo.access,test:true},(err,status,body)=>{
            if(status.statusCode === 200   && body["Message"] === "User has succesfully added"){
                this.componentData.addTestUserNotification = this.notification("success form-success","Test User Successfully Created");
            } else {
                if(body["Message"] === "User is currently exist"){
                    this.componentData.addTestUserNotification = this.notification("error form-error","Email already exists, user another email.");
                } else {
                    this.componentData.addTestUserNotification = this.notification("error form-error","Test User could not be created");
                }
            }
            this.forceUpdate();
        });
    }

    inviteAdmin(){

        var adminInfo = this.state.addAdminUserData;

        if(!adminInfo.fn || !adminInfo.ln || !adminInfo.pw){
            this.componentData.inviteAdminNotification = this.notification("error form-error","Fields marked with a * cannot be left blank");
            this.forceUpdate();
            return;
        }

        apiCall.post('/adduser',{email:adminInfo.email,firstname:adminInfo.fn,lastname:adminInfo.ln,password:adminInfo.pw,role:"Admin",Test:false},(err,status,body)=>{
            if(status.statusCode === 200  && body["Message"] === "User has succesfully added"){
                console.log(body);
                this.componentData.inviteAdminNotification = this.notification("success form-success","Admin succesfully invited");
            } else {
                if(body["Message"] === "User is currently exist"){
                    this.componentData.inviteAdminNotification = this.notification("error form-error","Email already exists, change role using table below.");
                } else {
                    this.componentData.inviteAdminNotification = this.notification("error form-error","Unable to invite admin");
                }

            }
            this.forceUpdate();
        });
    }

    cancelTestUser(){

    }

    updateTestUserSelect(newValue){
        this.state.addTestUserData.access = newValue.value;
        this.state.addTestUserData.selectValue = newValue;
        this.setState({addTestUserData:this.state.addTestUserData});
    }

    generatePassword(form){
        var generator = require('generate-password');
        this.state[form].pw = generator.generate({length: 10,numbers: true});
        this.setState({form:this.state[form]});
    }

    retrieveTestUser(){
        console.log("Retrieve test user called");
        apiCall.post('/testuser/create',{},(err, status, body)=>{
            console.log(body);
        });

    }

    toggleHidePW(form){
        this.state[form].hidePW = !this.state[form].hidePW;
        if(this.state[form].hidePW){
            this.state[form].pwInputType = "password";
        } else{
            this.state[form].pwInputType = "text";
        }
        this.setState({form:this.state[form]});
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
        let changeRoleNotification = this.state.changeUserRoleNotification;
        let addTestUserNotification = this.componentData.addTestUserNotification;
        let inviteAdminNotification = this.componentData.inviteAdminNotification;
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
            var isBlocked = "Blocked" in user.UserLogin ? user.UserLogin.Blocked : false;
            var timeout = user.UserLogin.Timeout;
            var userID = user.UserID;
            var email = user.UserContact.Email;
            var isTestUser = user.Test;
            var userRole = user.Role;
            var lastLogin = user.UserLogin.LastLogin;

            var selectOptions = [{value:"Admin", label:strings.admin},{value:"Enhanced",label:strings.enhanced},{value:"Participant",label:strings.participant},{value:"Guest",label:strings.guest},{value:"Teacher",label:"Teacher"}];
            organizationGroup = organizationGroup ? organizationGroup : "N/A";
            timeout = timeout ? dateFormat(timeout,"yyyy-mm-dd HH-MM-ss") : "-";
            isTestUser = isTestUser ? "Yes" : "No";
            userRole = userRole ? userRole : "No Role";
            lastLogin = lastLogin ? dateFormat(lastLogin,"yyyy-mm-dd HH-MM-ss") : "-";

            return {
                email: email,
                firstName: user.FirstName,
                lastName: user.LastName,
                organization: organizationGroup,
                testUser:isTestUser,
                systemRole:(<Select className="change-role-select" cssClassNamePrefix="user-manage-" onChange={this.changeRole.bind(this,userID,user.FirstName+" "+user.LastName,userRole)} clearable={false} searchable={false} value={userRole} options={selectOptions}/>),
                blockedStatus: (<ToggleSwitch isClicked={isBlocked} click={this.changeBlockedStatus.bind(this, userID, email, isBlocked)} />),
                resetPassword: (<button type='button' onClick={this.resetPassword.bind(this, email)}>Reset</button>),
                removeUser: (<button type='button' onClick={this.removeUser.bind(this, userID, email)}>Remove</button>),
                timeoutStatus:timeout,
                lastlogin:lastLogin
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
            this.componentData.passwordResetNotification = null;
        }

        if(addTestUserNotification){
            this.componentData.addTestUserNotification = null;
        }

        if(inviteAdminNotification){
            this.componentData.inviteAdminNotification = null;
        }

        //Display result of user role change
        if(changeRoleNotification){
            status = changeRoleNotification;
            this.state.changeUserRoleNotification = null;
        }

        //=================================================================================================
        // Total content returned
        return ( 
            <div>
                <div>
                <form name="invite_admin" role="form" className="section" method="POST">
                    <h2 className="title">Invite Administrator</h2>
                    <div className="section-content">
                        <table className="promote-instructor-table">
                        {inviteAdminNotification}
                            <tbody>
                                <tr><td>Email* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addAdminUserData","email")}/></td></tr>
                                <tr><td>First Name* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addAdminUserData","fn")}/></td></tr>
                                <tr><td>Last Name* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addAdminUserData","ln")}/></td></tr>
                                <tr><td>Organization </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addAdminUserData","organization")} /></td></tr>
                                <tr><td>Password* <button type="button" onClick={this.generatePassword.bind(this,"addAdminUserData")}>Generate Password</button> Hide <input checked={this.state.addAdminUserData.hidePW} onClick={this.toggleHidePW.bind(this,"addAdminUserData")} type="radio" /> </td><td><input disabled={true} type={this.state.addAdminUserData.pwInputType} value={this.state.addAdminUserData.pw}  onChange={this.onFieldInput.bind(this,"addAdminUserData","pw")}/></td></tr>
                                <tr><td></td><td><button type="button" onClick={this.inviteAdmin.bind(this)}>Invite</button></td></tr>      
                            </tbody>
                        </table>
                    </div>
                </form>

                <form name="create_test_user" role="form" className="section" method="POST">
                        <label><h2 className="title">Create Test User</h2></label>
                        <div className="section-content" >
                            <table className="promote-instructor-table">
                                {addTestUserNotification}
                                <tbody>
                                    <tr><td>Email* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addTestUserData","email")}/></td></tr>
                                    <tr><td>First Name* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addTestUserData","fn")}/></td></tr>
                                    <tr><td>Last Name* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addTestUserData","ln")}/></td></tr>
                                    <tr><td>User Role* </td><td><Select className="change-role-select" clearable={false} value={this.state.addTestUserData.selectValue} onChange={this.updateTestUserSelect.bind(this)} searchable={false} options={[{value:"Guest",label:"Guest"},{value:"Participant",label:"Participant"},{value:"Teacher",label:"Teacher"},{value:"Enhanced",label:"Enhanced"},{value:"Admin",label:"Admin"}]}/></td></tr>
                                    <tr><td>Organization </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addTestUserData","organization")} /></td></tr>
                                    <tr><td>Password* <button type="button" onClick={this.generatePassword.bind(this,"addTestUserData")}>Generate Password</button> Hide <input checked={this.state.addTestUserData.hidePW} onClick={this.toggleHidePW.bind(this,"addTestUserData")} type="radio" /> </td><td><input disabled={true} type={this.state.addTestUserData.pwInputType} value={this.state.addTestUserData.pw}  onChange={this.onFieldInput.bind(this,"addTestUserData","pw")}/></td></tr>
                                    <tr><td></td><td><button type="button" onClick={this.createTestUser.bind(this)}>Add</button></td></tr>
                                </tbody>
                            </table>
            
                        </div>
                </form>
                </div>
                <div>

                <form name="user_management_table" role="form" className="section" method="post">
                    <div className="section-content">
                        <h2 className="title">Manage Users</h2>

                        {status}

                        <ReactTable
                        filterable
                        defaultPageSize={10}
                        className="user-management-table"
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
                        Header: strings.timeout,
                        accessor: 'timeoutStatus',
                        },
                        {
                        Header: strings.lastlogin,
                        accessor: 'lastlogin',
                        },
                        {
                        Header: strings.resetPW,
                        accessor: 'resetPassword',
                        },
                        ]} 
                        noDataText={strings.noUsers}
                        />
                    </div>
                </form>
                </div>
            </div>
        );
    }
}

export default UserManagementContainer;
