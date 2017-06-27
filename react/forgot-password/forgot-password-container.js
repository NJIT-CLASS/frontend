import React, { Component } from 'react'; //import the React library and the Component class from the react package

class ForgotPasswordContainer extends Component { //create a class for the component
                                                  //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor 
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
                        // or C's int main() or Python's def main()

        this.state = {}; //initial state, only manually assigned here, elsewhere it's this.setState() 
    }

    render(){
        let strings = {         // define all your strings in an object like this one (the name of the keys can be anything)
                                // we use this for our translation system 
            HiString: 'Hi'
        };

        return (
            <div>{strings.HiString}</div>
        );
    }
}

export default ForgotPasswordContainer;