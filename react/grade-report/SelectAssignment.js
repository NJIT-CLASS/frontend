import React from 'react';
import apiCall from '../shared/apiCall';


class SelectAssignment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Strings:null,
            loaded:false
        };
    }

    componentDidMount(){

        // TODO: Need to finish endpoint for retrieving grades per section - currently only gets sections and returns debug info for each section
        apiCall.get(`/instructor/allSections/allGrades/${this.props.UserID}`,(err,status,body)=>{
            if(status.statusCode === 200){
                console.log(body);
                this.setState({loaded:true});
            }
        });
    }



    render(){
        let {Strings, loaded} = this.state;
        if(!loaded)
            return (<div></div>);

        return (
            <div>
                Select Assignment
            </div>    
        
        );
    }
}

export default SelectAssignment;