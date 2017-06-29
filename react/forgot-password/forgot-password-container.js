import React, { Component } from 'react'; //import the React library and the Component class from the react package

class ForgotPasswordContainer extends Component { //create a class for the component
                                                  //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
                        // or C's int main() or Python's def main()

        this.state = {

            passwordReset: false,
            error: false

        }; //initial state, only manually assigned here, elsewhere it's this.setState()
    }

    render(){
        let strings = {         // define all your strings in an object like this one (the name of the keys can be anything)
                                // we use this for our translation system
            HeaderText: 'Participatory Learning',
            ActionText: 'Forgot Your Password?',
            SuccessMessage: 'Your password has been reset. An email has been sent to your login email address.',
            ErrorMessage: 'The email entered was not recognized.',
            ButtonText: 'Change Password',
            PlaceHolderText: 'Email',

        };

        let Display;

        //reset password success
        this.setState({passwordReset: true});
        //reset password error
        this.setState({error: true});
        let passwordResetSuccess = new Promise(function(resolve, rject) {
            if (this.state.passwordReset) {
                resolve(SuccessMessage);
            }
            if (this.state.error) {
                reject(ErrorMessage);
            }
        });

        passwordResetSuccess.then(function(fromResolve) {
          //not yet implemented
        });

        return (
          <div className="main-container center">
              <div className="loggedout-container">
                  <div className="login-container">
                      <h2>
                          <i className="fa fa-graduation-cap"></i>
                          <span>Participatory Learning</span>
                      </h2>

                      <form role="form" className="section" method="POST">
                        <h2 className="title">{strings.ActionText}</h2>
                        <div className="section-content">
                                {
                            this.state.passwordReset && <div className="success form-success">
                          <span>{strings.SuccessMessage}</span>
                          </div>
                            }

                                {
                            this.state.error && <div className="error form-error">
                          <i className="fa fa-exclamation-circle"></i>
                          <span>{strings.ErrorMessage}</span>
                          </div>
                            }

                          <div>
                            <input placeholder={strings.PlaceHolderText} name="email" type="email" autofocus />
                          </div>
                          <button type="submit">{strings.ButtonText}</button>
                      </div>
                  </form>
                </div>
              </div>
            </div>
        );
    }
}

export default ForgotPasswordContainer;
