import React from 'react';
import Dropdown from 'react-dropdown';
import NumericInput from 'react-numeric-input';
import Checkbox from './checkbox';

class ProblemDetailsComponent extends React.Component{
    constructor(props){
      super(props);
      //this.props.:
      //numWorkflows
      this.state = {
        ShowContent: true,
        Params: {
          Name:'',
          Type:'',
          NumberOfSets: 0,
          Description:'',
          GroupSize: 0,
          GradeDistribution:{

          }
        }
      };
    }

    changeData(stateField, value){
      let newParams = this.state.Params;
      newParams[stateField] = value;
      this.setState({
        Params: newParams
      });
    }
    changeInputData(stateField, e){
      let newParams = this.state.Params;
      newParams[stateField] = e.target.value;
      this.setState({
        Params: newParams
      });
    }
    changeDropdownData(stateField, e){
      let newParams = this.state.Params;
      newParams[stateField] = e.value;
      this.setState({
        Params: newParams
      });
    }

    render(){
      let problemTypeValues=['Essay','Mutliple Choice','Short Answer','Computer'];
      return (
        <div className="section card-1">
          <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}>Problem Parameters</h2>
          <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>
            <div className='section-divider'>
              <div className='inner'>
                <label>Problem Name</label>
                <br />
                <input type="text" placeholder="Name" value={this.state.Params.Name} onChange={this.changeInputData.bind(this, 'Name')}/>
              </div>

              <div className='inner'>
                <label>Problem Type</label>
                <Dropdown options={problemTypeValues}
                          selectedValue={this.state.Params.Type}
                          onChange={this.changeDropdownData.bind(this,'Type')}
                          />
              </div>

              <div className='inner'>
                <label>How many people per group</label>
                <br />
                <NumericInput min={0}
                              value={this.state.Params.GroupSize}
                              onChange={this.changeData.bind(this,'GroupSize')}/>
              </div>

              <div className='inner'>
                <label>How many problems of this type</label>
                <br />
                  <NumericInput min={0}
                                value={this.state.Params.NumberOfSets}
                                onChange={this.changeData.bind(this,'NumberOfSets')}/>
              </div>

              <div className='inner block'>
                <label>Description</label>
                <br />
                <textarea className="big-text-field" placeholder="Description"
                          value={this.state.Params.Description}
                          onChange={this.changeInputData.bind(this,"Description")} ></textarea>
              </div>

              <div className='inner block'>
                <label>Custom Grade Weights (Equal Otherwise)</label>
                <ul>
                  <li style={{margin: '0px', borderBottom: '0px'}}> <label>Create</label> <input></input></li>
                  <li style={{borderBottom: '0px'}}> <label>Edit</label> <input></input></li>
                  <li style={{borderBottom: '0px'}}> <label>Solve</label> <input></input></li>
                </ul>
            </div>

            </div>
          </div>
        </div>
      );
    }
}

export default ProblemDetailsComponent;
