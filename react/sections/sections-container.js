import React from 'react';
import request from 'request';
import Select from 'react-select';
import VolunteerPool from '../volunteer-pool/volunteer-pool-container';
class Sections extends React.Component{

    constructor(props){
        super(props);

        this.state = {
        };
    }

    componentWillMount(){
        const requestOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/SectionsByUser/69',// + this.props.UserID, // get all sections by user
            json: true
        };

        request(requestOptions, (err, res, body) => {
            let sectionArray = [];
            console.log(body.Sections);
            sectionArray = body.Sections.map(function(section){
              return ({value: section.SectionID, label: section.Section.Course.Number + '-' + section.Section.Name  });
          });

            this.setState({
              sections: sectionArray,
              sectionsData: body.Sections
          });
        });
    }

    selectedSection(section){
        this.setState({selectedValue: section.value});
    }


    render(){
        let sectionSelected = null;
        if (this.state.selectedValue != null){
            sectionSelected = (
        <div>
          <VolunteerPool sectionID={this.state.selectedValue} userRole={'Instructor'} apiUrl={this.props.apiUrl}/>
        </div>
      );
        }


        return(
      <div className="Sections">
        <Select options={this.state.sections} value={this.state.selectedValue} onChange={this.selectedSection.bind(this)} />
        {sectionSelected}
      </div>

        );
    }

}

export default Sections;
