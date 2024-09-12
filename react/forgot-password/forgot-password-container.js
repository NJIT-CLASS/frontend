import React, { Component } from 'react'; //import the React library and the Component class from the react package
import apiCall from '../shared/apiCall';
import Tooltip from '../shared/tooltip';

class ForgotPasswordContainer extends Component { //create a class for the component
    //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
        // or C's int main() or Python's def main()

        this.state = {

            value: '',
            result: ''

        }; //initial state, only manually assigned here, elsewhere it's this.setState()

        this.handleCancel = this.handleCancel.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        apiCall.post('/password/reset', {email: this.state.value}, (err, res, body) => {
            if(res.statusCode == 401) {
                console.log('User does not exist.');
                this.setState({
                    result: 'wrong-email'
                });
            } else if (res.statusCode == 200) {
                console.log('Email sent.');
                this.setState({
                    result: 'success'
                });
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 3000);
            } else {
                console.log('An error occurred.');
                this.setState({
                    result: 'error'
                });
            }
        });

    }

    handleCancel(){
        history.back();
    }


    render(){
        let strings = {         // define all your strings in an object like this one (the name of the keys can be anything)
            // we use this for our translation system
            HeaderText: 'Participatory Learning',
            ActionText: 'Forgot Your Password?',
            SuccessMessage: 'Your password has been reset. An email has been sent to your login email address.',
            ErrorMessage0: 'The email entered was not recognized.',
            ErrorMessage1: 'The website is experiencing some internal errors. Please try again later.',
            ButtonText: 'Change Password',
            PlaceHolderText: 'Email',
            Cancel: 'Cancel'

        };

        let submitButton = (
            <button type="submit">{strings.ButtonText}</button>
        );
        if (this.state.result == 'success'){
            submitButton = <div></div>;
        }

        return (
            <div className="main-container center">
                <div className="loggedout-container">
                    <div className="login-container">
                        <h2>
                            <i className="fa fa-graduation-cap" onClick={this.handleCancel}></i>
                            <span>Participatory Learning</span>
                        </h2>

                        <form role="form" className="section" style={{margin: '0 auto', width: 313.91}} onSubmit={this.handleSubmit.bind(this)}>
                            <div style={{position:"relative"}}>
                                <h3 style={{display:"inline-block",paddingRight:"0%",marginBottom: 0}} className="title">{strings.ActionText}</h3>
                                <Tooltip style={{display:"inline-block",marginTop:"8%"}} Text={"If you change your password, PL will send a temporary password to your registered PL email address.  You will be asked to choose a new password when you log in."} ID={'reset_password_tooltip'} />
                            </div>
                            <div className="section-content">

                                {
                                    (this.state.result == 'success') && (<div className="success form-success" style={{marginBottom: 0}}>
                                        <span>{strings.SuccessMessage}</span>
                                    </div>)
                                }

                                {
                                    (this.state.result == 'wrong-email') && (<div className="error form-error">
                                        <i className="fa fa-exclamation-circle"></i>
                                        <span>{strings.ErrorMessage0}</span>
                                    </div>)
                                }

                                {
                                    (this.state.result == 'error') && (<div className="error form-error">
                                        <i className="fa fa-exclamation-circle"></i>
                                        <span>{strings.ErrorMessage1}</span>
                                    </div>)
                                }

                                <input placeholder={strings.PlaceHolderText} style={{width:"80%"}} type="email" value={this.state.value} onChange={this.handleChange.bind(this)} /><Tooltip Text={"Use the email address you were invited with originally.   This may be different from your personal or institutional email address."} ID={'passwordreset_email_tooltip'} />
                                <button type="button" onClick={this.handleCancel}>{strings.Cancel}</button>
                                &nbsp;
                                {submitButton}
                            </div>
                        </form>
                        <p>What is Participatory Learning?<a href="/about" class="link">Click here to learn more.</a></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgotPasswordContainer;
