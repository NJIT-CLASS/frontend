import React from 'react';
import Modal from '../shared/modal';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class ModalInfo extends React.Component{

    constructor(props){
        super(props);

    }

    /*modalToggle(){
        this.setState({
            Show: this.state.Show ? false : true
        });
    }*/
    render(){
        let modalView = null;
        let modStyle = {borderRadius:'3px 3px 3px 3px'};
        let modTitle = this.props.TA_Type +' ('+this.props.StudentName+')';
        let reassignHist = null;
        if(this.props.TaskUserHistory == null || this.props.TaskUserHistory.length == 0){
            reassignHist = (<li>This task has never been reassigned.</li>);
        }
        else{
            reassignHist = Object.keys(this.props.TaskUserHistory).map(function(uh){
                return (<li>{uh} - {this.props.TaskUserHistory[uh]}</li>);
            }, this);
        }
        if(this.props.Show){
            modalView = (
        <Modal title={modTitle} styles={modStyle} close={this.props.modalToggle.bind(this)}>
          <div className= "modal-section">
            <h3>{this.props.Strings.TaskProperties}</h3> <br/>
            <p><b>{this.props.Strings.TaskType}: </b>{this.props.TA_Type} </p>
            <p><b>{this.props.Strings.AssignedTo}: </b> {this.props.StudentName} </p>
            <p><b>{this.props.Strings.Status}: </b> {this.props.TaskStatus}</p>
          </div>
          <div className="modal-section">
            <h3>{this.props.Strings.ReassignHistory}</h3><br />
              <ol>
                {reassignHist}
              </ol>
          </div>
          <div className="modal-section">
            <h3>{this.props.Strings.TaskActions}</h3> <br />
            <p><a href={this.props.Link}>{this.props.Strings.ViewDetail}</a></p>
            <p><a href="#">{this.props.Strings.ReopenTask}</a></p>
            <p><a href="#">{this.props.Strings.Reassign}</a></p>
          </div>
          <button type="button" onClick={this.props.modalToggle.bind(this)}>{this.props.Strings.Close}</button>
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

ModalInfo.defaultProps = {TA_Type: 'Resolve the Dispute',
    StudentName: 'Student',
    TaskStatus: 'Complete',
    TaskID: 10,
    TaskUserHistory:[],
    Link: '',
    UserRole: 'Student',
    Show: false,
    Strings: {
        TaskActions: 'Task Actions',
        ReassignHistory: 'Reassign History',
        TaskProperties: 'Task Properties',
        TaskType: 'Task Type',
        AssignedTo: 'Assigned to',
        Status: 'Status',
        ViewDetail: 'View task in greater detail',
        ReopenTask: 'Re-open task for user',
        Reassign: 'Reassign this task to another user',
        Close: 'Close'

    }
};

export default ModalInfo;
