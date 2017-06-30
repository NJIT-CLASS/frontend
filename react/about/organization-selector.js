import React from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';

class OrganizationSelector extends React.Component {
  constructor(props){
      super(props);
      this.state = {};
  }
// load all organizations when page loads
  componentWillMount() {
      this.fetchAll();
  }
// retrieve all organizations in system
// format as organizationID, Name tuples for select component
  fetchAll() {
      apiCall.get('/organization', (err, res, body) => {
          let list = [];
          for (let org of body.Organization) {
              list.push({ value: org.OrganizationID, label: org.Name});
          }
          this.setState({
              list: list
          });
      });
  }

// send selected ID to parent if it changed, exit edit mode on successful ID change
  changeID(option) {
    if(this.state.id != option.value) {
        this.setState({
            id: option.value,
            ContactName: '', /*must implement API to access contact name and email*/
            ContactEmail: ''
        });
    }
  }

// prevent default form submission
    onSubmit(event) {
        event.preventDefault();
    }

    render() {
        let strings = {
            TitleString: 'Organization'
        };

        let select = (
          <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
            <Select style={{width: '250px'}} options={this.state.list} value={this.state.id} onChange={this.changeID.bind(this)} resetValue={''} clearable={true} searchable={true}/>
          </form>
		      );

        let info = (
          <div>
              <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                <Select style={{width: '250px'}} options={this.state.list} value={this.state.id} onChange={this.changeID.bind(this)} resetValue={''} clearable={true} searchable={true}/>
              </form>
              <div className="section-content">
                <ul>
                  <li>Name: {this.state.ContactName}</li>
                  <li>Email: {this.state.ContactEmail}</li>
                  </ul>
              </div>
            </div>
    );

        if(typeof this.state.id !== 'undefined') {
            return info;
        } else {
            return select;
        }

    }
}

export default OrganizationSelector;
