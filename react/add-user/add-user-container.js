import React from 'react';
import Select from 'react-select';
import Checkbox from '../shared/checkbox';
import PasswordField from '../shared/passwordField';
import {clone, cloneDeep} from 'lodash';
import Strings from './strings.js';
import apiCall from '../shared/apiCall';

class AddUserContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            role: 'Student',
            instructor: false,
            admin: false,
            firstnameError: false,
            lastnameError: false,
            displayError: false,
            displayFeedback: false,
            pass: '',
            Strings: Strings
        };
    }

    componentWillMount(){
        this.props.__(Strings, newStrings => {
            this.setState({
                Strings: newStrings
            });
        });
    }

    onChangeRole(user_role) {
        this.setState({role: user_role.value});

    }

    onChangeAdminRole(e){
        this.setState({
            admin : !this.state.admin
        });
    }
    onChangeInstructorRole(e){
        this.setState({
            instructor : !this.state.instructor
        });
    }

    onChangeFirstname(name){
        this.setState({firstname: name.target.value});
    }
    onChangeLastname(name){
        this.setState({lastname: name.target.value});

    }
    onChangeEmail(email){
        this.setState({email: email.target.value});

    }
    onPassGenerator(){ // this function will provide a randomize password
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890!@#$%&';
        var pass = '';
        for (var x = 0; x < 10; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return this.setState({pass: pass});
    }

    onChangePass(pass, isStrongEnough){
        this.setState({pass: pass});
    }

    adduserSubmit(content){
        content.preventDefault();

        const {firstname, lastname, email,admin,instructor, pass} = this.state;
        const firstnameError = firstname.length === 0 ? true : false;
        const lastnameError = lastname.length === 0 ? true : false;
        if( firstnameError || lastnameError ){
            return this.setState({
                displayError: true,
                firstnameError: firstnameError,
                lastnameError: firstnameError
            });
        } else{
            this.setState({
                displayError: false,
                firstnameError: false,
                lastnameError: false
            });
        }


        const vars = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                instructor: instructor,
                admin: admin,
                password: pass
            };


        apiCall.post('/addUser', vars, (err, res, body) => {
          showMessage(this.state.Strings.SuccessfulAdd);
            console.log(body.Message);
        });
    }




    render() {
        let errorView = null;
        const Strings = this.state.Strings;
        var roles = [
          { value: 'Student', label: 'Student' },
          { value: 'Instructor', label: 'Instructor' },
          { value: 'Admin', label: 'Admin' }
        ];

        if(this.state.displayError){
            errorView = (<div className="error form-error" role="alert">
        <i className="fa fa-exclamation-circle"></i>
          <span className="sr-only">{Strings.error} </span>
        </div>);
        }

        return (
          <div className="section add-user-details">
            <h2 className="title">{Strings.UserDetails}</h2>


            {errorView}




            <form className="section-content" onSubmit={this.adduserSubmit.bind(this)}>
              <table>
                <tr>
                  <td>
                    <div>
                      <label>{Strings.FirstName}:</label>
                      <input type="text"
                        name="firstname"
                        onChange={this.onChangeFirstname.bind(this)}
                        className={ this.state.firstnameError ? 'error' : '' }/>
                    </div>
                  </td>
                  <td>
                    <div>
                      <label>{Strings.LastName}:</label>
                      <input type="text"
                        name="lastname"
                        onChange={this.onChangeLastname.bind(this)}
                        className={ this.state.lastnameError ? 'error' : '' }
                      />
                    </div>
                  </td></tr>
                <tr>
                  <td>  <div>
                    <label>{Strings.Email}:</label>
                    <input type="text"
                      name="email"
                      onChange={this.onChangeEmail.bind(this)}/>
                  </div>
                  </td><td>
                    <div>
                      <label>{Strings.IsAdmin}:</label>
                      <Checkbox click={this.onChangeAdminRole.bind(this)} isClicked={this.state.admin} />
                    </div>
                    <div><label>{Strings.IsInstructor}:</label>
                    <Checkbox click={this.onChangeInstructorRole.bind(this)} isClicked={this.state.instructor} /></div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <label>{Strings.Password}:</label>
                      <br />
                      <PasswordField value={this.state.pass} onChange={this.onChangePass.bind(this)} Strings={Strings} />

                    </div>
                  </td>
                  <td>
                    <div className="grouped">
                      <button className="row generate-pass" type="button" name="generate" onClick={this.onPassGenerator.bind(this)}>{Strings.GeneratePassword}</button>
                    </div>
                  </td>

                </tr>
                <tr><td>
                  <div>
                    {/*}<label>Course Section:</label>
                      <Select
                      name="section"
                      searchable={false}
                      clearable={false}
                    />*/}
                  </div>
                </td></tr>
              </table>

              <div className="row">
                <div className="section-button-area">
                  <button type="submit">{Strings.AddUser}</button>
                </div>
                  </div>
              </form>
          </div>
        );
    }
}


export default AddUserContainer;
