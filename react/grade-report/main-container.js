import React from 'react';
import apiCall from '../shared/apiCall';

class GradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
        };
    }

    componentDidMount(){
        apiCall.get(`/gradeReport`,{ai_id:1},(err,status,body)=>{
            console.log(body);
        });
    }

    redner(){
        return (<div>test</div>);
    }
}

export default GradeReport;