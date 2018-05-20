import React, { Component } from 'react'; //import the React library and the Component class from the react package
import apiCall from '../shared/apiCall';

class ForgotPasswordContainer extends Component { //create a class for the component
    //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
        // or C's int main() or Python's def main()

        this.state = {

            value: '',
            result: ''

        }; //initial state, only manually assigned here, elsewhere it's this.setState()
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
                            <i className="fa fa-graduation-cap"></i>
                            <span>Participatory Learning</span>
                        </h2>

                        <form role="form" className="section" style={{margin: '0 auto', width: 313.91}} onSubmit={this.handleSubmit.bind(this)}>
                            <h2 className="title" style={{marginBottom: 0}}>{strings.ActionText}</h2>
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

                                <input placeholder={strings.PlaceHolderText} type="email" value={this.state.value} onChange={this.handleChange.bind(this)} />
                                <button type="button" onClick={this.handleCancel.bind(this)}>{strings.Cancel}</button>
                                &nbsp;
                                {submitButton}
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        );
    }
}

export default ForgotPasswordContainer;
