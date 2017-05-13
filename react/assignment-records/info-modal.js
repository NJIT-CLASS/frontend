import React from 'react';
import Modal from '../shared/modal';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class ModalInfo extends React.Component{

  constructor(props){
    super(props);

    this.state={
      Show: true
    };
  }

  componentWillReceiveProps(props) {
    return;
 }

  modalToggle(){
    this.setState({
      Show: this.state.Show ? false : true
    });
  }
  render(){
    let modalView = null;
    let modStyle = {borderRadius:"3px 3px 3px 3px"};
    let modTitle = this.props.TaType +" ("+this.props.StudentName+")";
    let reassignHist = null;
    if(!this.props.TaskUserHistory || this.props.TaskUserHistory.length == 0){
      reassignHist = (<li>This task has never been reassigned.</li>);
    }
    else{
      reassignHist = this.props.TaskUserHistory.map(function(uh){
        return (<li>{uh}</li>);
      });
    }
    if(this.state.Show){
      modalView = (
        <Modal title={modTitle} styles={modStyle} close={this.modalToggle.bind(this)}>
          <div className= "modal-section">
            <h3>Task Properties</h3> <br/>
            <p><b>Task Type: </b>{this.props.TaType} </p>
            <p><b>Assigned to: </b> {this.props.StudentName} </p>
            <p><b>Status: </b> {this.props.TaskStatus}</p>
          </div>
          <div className="modal-section">
            <h3>Reassign History</h3><br />
              <ol>
                {reassignHist}
              </ol>
          </div>
          <div className="modal-section">
            <h3>Task Actions</h3> <br />
            <p><a href={'/task/' + this.props.TaType +"/"+this.props.TaskID}>View task in greater detail</a></p>
            <p><a href="#">Re-open task for user</a></p>
            <p><a href="#">Reassign this task to another user</a></p>
          </div>
          <button type="button" onClick={this.modalToggle.bind(this)}>Close</button>
        </Modal>);
    }

    return (<div className="animate-fast fadeIn">
            <ReactCSSTransitionGroup transitionName="example" transitionEnter={false} transitionLeaveTimeout={200}>
              {modalView}
            </ReactCSSTransitionGroup>
            </div>
      );
  }

}

ModalInfo.defaultProps = {TaType: "Resolve the Dispute",
                          StudentName: "Student 4",
                          TaskStatus: "Complete",
                          TaskID: 10,
                          TaskUserHistory:[],
                          Role: "Student"}

export default ModalInfo;
