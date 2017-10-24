import React, {Component} from 'react';
import apiCall from '../shared/apiCall';
import ToggleSwitch from '../shared/toggleSwitch';
import strings from './strings';

class UserManagementContainer extends Component{

    constructor(props){
        super(props);
        this.state = {
            instructorEmail: '',
            instructorList: [],
            addInstructorSuccess: null,
            promoteInstructorSuccess: null,
            addInstructorErrMessage: '',
            loaded: false
        };
    }

    componentDidMount(){
        this.fetchInstructors();
    }

    fetchInstructors(){
        apiCall.getAsync('/instructor/all',{}).then(body => {
            this.setState({
                instructorList: body.data.Instructors
            });
        });
    }

    onChangeInstructorEmail(email){
        this.setState({ instructorEmail : email.target.value });
    }

    onSubmitEmail(){
        console.log(this.state.instructorEmail);
        apiCall.put('/instructor/new', {email: this.state.instructorEmail}, (err, status, body) => {
            if(status.statusCode != 200){
                this.setState({addInstructorSuccess: false});
            } else {
                this.setState({addInstructorSuccess: true});
            }
        });
    }

    onPromoteInstructor(isAdmin, userID, fullName){
        console.log("promoted");
        let endpoint = '';

        if(isAdmin){
            endpoint = '/makeUserNotAdmin/';
        } else {
            endpoint = '/makeUserAdmin/';
        }

        apiCall.put(endpoint,{ UserID: userID }, (err, res, body) => {
            if(res.statusCode != 200){
                this.setState({promoteInstructorSuccess: false});
            } else {
                this.setState({promoteInstructorSuccess: true});
            }
        });

        this.fetchInstructors();
    }

    fetchInstructorEmail(userID, cb){
        apiCall.getAsync(`/generalUser/${userID}`,{}).then(body => {
            cb({email: body.data.User.UserLogin.Email});
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
        let instructors = this.state.instructorList;
        let addInstructorSuccess = this.state.addInstructorSuccess;
        let promoteInstructorSuccess = this.state.promoteInstructorSuccess;

        // Creates rows for the Promote Instructor from
        let instructorView = instructors.map( instructor => {


            let fullName = instructor.FirstName + " " + instructor.LastName;
            let isAdmin = instructor.Admin;
            let userID = instructor.UserID;
            let email = '';

            /*
            this.fetchInstructorEmail(userID, (retrievedEmail)=>{
                email = retrievedEmail.email;
            });
            */

            return (<tr>
                    <td>
                        <h1 >{fullName}</h1>
                    </td>
                    <td>
                        <ToggleSwitch className="promote-instructor-toggle" isClicked={isAdmin} click={this.onPromoteInstructor.bind(this, isAdmin, userID, fullName)} />
                    </td>
            </tr>);
        });

        // Displays success or error in Add New Instructor form, if the user submitted data
        let addInstructorResultView = null;
        if(addInstructorSuccess !== null){
            if(addInstructorSuccess){
                addInstructorResultView = this.notification("success form-success",strings.instructorAddedSuccess);
            } else {
                addInstructorResultView = this.notification("error form-error",strings.instructorAddedFailure);
            }
        }

        // Displays success or failure in Promote Instructor Form
        let promoteInstructorResultView = null;
        if(promoteInstructorSuccess !== null){
            if(promoteInstructorSuccess){
                promoteInstructorResultView = this.notification("success form-success",strings.instructorPromotedSuccess);
            } else {
                promoteInstructorResultView = this.notification("error form-error",strings.instructorPromotedFailure);
            }
        }

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

                <form name="form_promoteInstructorToAdmin" role="form" className="section" method="POST" action="#">
                        <h2 className="title">{strings.titlePromoteInstructor}</h2>
                        <div className="section-content promote-instructor-table">

                            {promoteInstructorResultView}

                            <table>
                                <thead>
                                        <td>
                                            <h1>{strings.instructor}</h1>
                                        </td>
                                        <td>
                                            <h1>{strings.status}</h1>
                                        </td>
                                </thead>

                                <tbody>
                                    {instructorView}
                                </tbody>
                            </table>
                        </div>
                </form>
            </div>
        );
    }
}

export default UserManagementContainer;