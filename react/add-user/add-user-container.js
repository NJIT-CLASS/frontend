import React from 'react';
import Select from 'react-select';
import request from 'request';
import Checkbox from '../shared/checkbox';
import {clone, cloneDeep} from 'lodash';

class AddUserContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            role: 'Student',
            firstnameError: false,
            lastnameError: false,
            displayError: false,
            displayFeedback: false,
            pass: ''
        };
    }
    onChangeRole(user_role) {
        this.setState({role: user_role.value});

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

    onChangePass(event){
        this.setState({pass: event.target.value});
    }

    adduserSubmit(content){
        content.preventDefault();
        const firstname = this.state.firstname;
        const lastname = this.state.lastname;
        const email = this.state.email;
        const role = this.state.role;
        const pass = this.state.pass;
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


        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/adduser',
            body: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                role: role,
                password: pass
            },
            json: true
        };

        request(options, (err, res, body) => {
            console.log(body.Message);
        });
    }

  /*checkThesuser(){
    const options = {
      method: 'GET',
      uri: 'http://localhost:400/api/adduser',
      body: {
        userid: 1
      },
      json: true
    };

    request(options, (err, res, body) => {

    })
  }*/


    render() {
  //  checkThesuser();
        let errorView = null;
        var roles = [
          { value: 'Student', label: 'Student' },
          { value: 'Instructor', label: 'Instructor' },
          { value: 'Admin', label: 'Admin' }
        ];

        if(this.state.displayError){
            errorView = (<div className="error form-error" role="alert">
        <i className="fa fa-exclamation-circle"></i>
          <span className="sr-only"> Error: Must Enter First and Last Name. </span>
        </div>);
        }

        return (
          <div className="section add-user-details">
            <h2 className="title">User Details</h2>


            {errorView}




            <form className="section-content" onSubmit={this.adduserSubmit.bind(this)}>
              <table>
                <tr>
                  <td>
                    <div>
                      <label>First Name:</label>
                      <input type="text"
                        name="firstname"
                        onChange={this.onChangeFirstname.bind(this)}
                        className={ this.state.firstnameError ? 'error' : '' }/>
                    </div>
                  </td>
                  <td>
                    <div>
                      <label>Last Name:</label>
                      <input type="text"
                        name="lastname"
                        onChange={this.onChangeLastname.bind(this)}
                        className={ this.state.lastnameError ? 'error' : '' }
                      />
                    </div>
                  </td></tr>
                <tr>
                  <td>  <div>
                    <label>Email:</label>
                    <input type="text"
                      name="email"
                      onChange={this.onChangeEmail.bind(this)}/>
                  </div>
                  </td><td>
                    <div>
                      <label>Role:</label>
                      <Select
                        name="role"
                        value={this.state.role}
                        options={roles}
                        clearable={true}
                        searchable={true}
                        onChange={this.onChangeRole.bind(this)}
                      />
                    </div>
                  </td></tr>
                <tr>
                  <td>
                    <div>
                      <label>Password:</label>
                      <input type="text"
                        name="pass"
                        value={this.state.pass}
                        onChange={this.onChangePass.bind(this)}
                      />


                    </div>
                  </td>
                  <td>
                    <div className="grouped">
                      <button className="row generate-pass" type="button" name="generate" onClick={this.onPassGenerator.bind(this)}>Generate Password</button>
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
                  <button type="submit">Add User</button>
                </div>

                  </div>
              </form>
          </div>
        );
    }
}


export default AddUserContainer;
