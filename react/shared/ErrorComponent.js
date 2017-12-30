import React, { Component } from 'react';

export default class ErrorComponent extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            Error: false
        };
    }
    componentDidCatch(error, info){
        console.log(error, info);
        this.setState({
            Error: true
        });
    }
    render() {
        if(this.state.Error === true){
            return (
                <div>
                    Sorry, there was an error. Check the broswer's console for more info >>>
                </div>
            );
        }
        return this.props.children;
    }
}
