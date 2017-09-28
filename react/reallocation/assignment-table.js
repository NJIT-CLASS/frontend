import React from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';
import ReactLoading from 'react-loading';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Reallocate from './reallocate';
import ReallocateInputBox from './reallocate-input-box';


export default class AssignmentTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            StructLoaded: false,
            DataLoaded: false,
            Select: {
                Name: 'Unknown',
                UserID: null,
                TaskInstanceID:null
            }
        };
    }

    componentWillMount() {
        this.fetchStructure();
        this.fetchData();
    }

    componentWillReceiveProps(props) {
        if (this.props.AssignmentInstanceID != props.AssignmentInstanceID) {
            this.fetchStructure(props);
            this.fetchData(props);
            this.setState(this.state);
        }
    }

    fetchData(props = null) {
        if (!props) {
            props = this.props;
        }

        apiCall.get(`/assignment/data/${props.AssignmentInstanceID}`, (err, res, body) => {
            //console.log(err, res, body);
            this.setState({
                Data: body.Data,
                Students: body.Students,
                DataLoaded: true,
            });
        });
    }

    fetchStructure(props = null) {
        if (!props) {
            props = this.props;
        }

        apiCall.get(`/assignment/structure/${props.AssignmentInstanceID}`, (err, res, body) => {
            //console.log(err, res, body);
            let columns = {};

            body.Structure.map((wf) => {
                let data = [];

                wf.Tasks.map((task) => {
                    data.push({
                        Header: task.Name,
                        id: task.TaskActivityID,
                        accessor: JSON.stringify(task.TaskActivityID),
                    });
                });

                columns[wf.WorkflowActivityID] = data;
            });

            this.setState({
                //Columns: columns,
                Structure: body.Structure,
                StructLoaded: true
            });
        });
    }

    getData(wa_id){
        let array = this.state.Data[wa_id].workflows;
        let data = [];
        array.map((wf) => {
            data.push(wf.Tasks);
        });

        return data;

    }

    expandComponent(row) {
        return (
            <div>
                <p>{this.state.Select.Name}</p>
                <Reallocate selected={this.state.Select} students={this.state.Students} change={this.fetchData.bind(this)}/>
            </div>
        );
    }

    renderTables() {

        const options = {
            expandRowBgColor: '#f9f9fc',
            expandBy: 'column',  // Currently, available value is row and column, default is row
            onlyOneExpanding: true
        };

        if(this.state.Structure.length == 0){
            return <p>No Assignment Found</p>;
        } else {
            return this.state.Structure.map((workflow) => {

                let data = this.getData(workflow.WorkflowActivityID);

                return (
                    <div>
                        <br/>
                        <BootstrapTable 
                            data={data} 
                            options={options}
                            expandableRow={() => true}
                            expandComponent={this.expandComponent.bind(this)}
                            keyBoardNav
                        >   
                            <TableHeaderColumn isKey dataField='id' headerAlign='center' expandable={false}>Workflow</TableHeaderColumn>
                            {this.renderHeaders(workflow.Tasks)}
                        </BootstrapTable>
                        <br/>
                    </div>
                    
                );
            });
        }

    }

    setExpandComponent(cell){
        this.setState({
            Select: {
                Name: cell.Name,
                UserID: cell.UserID,
                TaskInstanceID: cell.TaskInstanceID,
            }
        });
    }

    activeFormatter(cell, row){
        return (
            <div onClick={() => this.setExpandComponent(cell)}>
                <p>{cell.Name}</p>
                <p>{cell.UserID}</p>
                <p>{cell.TaskInstanceID}</p>
            </div>
        );
    }

    renderHeaders(tasks){
    
        if(tasks.length == 0){
            return <p>No Task Found</p>;
        } else {
            return tasks.map((task) => {
                return (
                    <TableHeaderColumn 
                        dataField={JSON.stringify(task.TaskActivityID)} 
                        dataFormat={this.activeFormatter.bind(this)}
                        headerAlign='center'
                    >{task.Name}</TableHeaderColumn>
                );
            });
        }
    }

    render() {

        if (!this.state.StructLoaded || !this.state.DataLoaded) {
            return <ReactLoading type = "spinningBubbles" color = "#444" / >;
        }

        return ( 
            <div className='card'> 
                <h2 className='title'>Table</h2>
                <br/>
                {this.renderTables()} 
                <ReallocateInputBox key={4} AssignmentInstanceID={this.state.assignmentInstanceID} SectionID={this.props.SectionID}/>
            </div>
        );
    }
}
