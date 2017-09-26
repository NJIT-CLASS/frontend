import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';

export default class SelectSection extends React.Component{

    constructor(props){
        super(props);
        this.state={};
    }

    componentWillMount(){
        this.fetch();
    }

    // componentWillReceiveProps(props){
    //     if(this.props.SectionID != props.SectionID){
    //         this.setState({
    //             sectionID:null
    //         });
    //     }
    //     this.fetch();
    // }


    fetch(props = null){
        let sections = [];

        if(!props){
            props = this.props;
        }
        
        apiCall.get(`/sections/instructor/${this.props.UserID}`, (err, res, body) => {
            body.Sections.map((section) => {
                sections.push({
                    'label':`${section.Section.Course.Number}-${section.Section.Name}`,
                    'value': section.SectionID //SectionID
                });
            });

            this.setState({
                sections: sections
            });
        });
    }

    changeSectionID(val){
        if(this.state.sectionID !== val.value){
            this.setState({
                sectionID:val.value
            });
    
            this.props.change(val.value);
        }
    }

    render(){
        return (
            <div className='card'>
                <h2 className='title'>Section</h2>
                <br/>
                <Select options={this.state.sections} value={this.state.sectionID} onChange={this.changeSectionID.bind(this)} placeholder="Selected" resetValue={''} clearable={true} searchable={true}/>
            </div>
        );
    }
}