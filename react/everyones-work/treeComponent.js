import React, { Component } from 'react';

import TreeView from 'react-treeview';
import apiCall from '../shared/apiCall';

class TreeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflow: null
        };
    }

    componentDidMount() {
        apiCall.get(`/EveryonesWork/alternate/${this.props.AssignmentID}`, (err, res, body) => {
            console.log(body);
            /*const workflows = body.Workflows['33'].WorkflowInstances;
            const workflowId = this.props.WorkflowID;
            for (let i = 0; i < workflows.length; i++) {
                if (workflows[i].WorkflowInstanceID == workflowId) {
                    this.state.workflow = workflows[i];
                    break;
                }
            }
            console.log(this.state.workflow);*/
        });
    }

    render() {
        return <div className="card">
            <TreeView nodeLabel={<a href="http://localhost:4001/task/1675" target="_blank"><span className="node">Create Problem 1</span></a>}>
                <TreeView nodeLabel={<a href="http://localhost:4001/task/1675" target="_blank"><span className="node">Revise 1</span></a>}>
                    <TreeView nodeLabel={<span className="node">Needs Consolidation</span>}>
                        <div>Consolidate revise</div>
                    </TreeView>
                </TreeView>
                <div>Revise 1</div>
            </TreeView>
            <TreeView nodeLabel={<a href="http://localhost:4001/task/1675" target="_blank"><span className="node">Create Problem 2</span></a>}>
                <div>Revise 2</div>
                <TreeView nodeLabel={<span className="node">Solve 2</span>}>
                    <TreeView nodeLabel={<span className="node">Grade Solve 2</span>}>
                        <TreeView nodeLabel={<span className="node">Needs Consolidation</span>}>
                            <TreeView nodeLabel={<span className="node">Consolidate</span>}>
                                <TreeView nodeLabel={<span className="node">Dispute</span>}>
                                    <div>Resolve Dispute</div>
                                </TreeView>
                                <div>Grade Consolidate</div>
                            </TreeView>
                        </TreeView>
                    </TreeView>
                    <div>Grade Solve 2</div>
                </TreeView>
                <TreeView nodeLabel={<span className="node">Create Problem 3</span>}>
                    <div>Solve 3</div>
                </TreeView>
                <TreeView nodeLabel={<span className="node">Grade Problem 2</span>}>
                    <TreeView nodeLabel={<span className="node">Needs Consolidation</span>}>
                        <TreeView nodeLabel={<span className="node">Consolidate</span>}>
                            <TreeView nodeLabel={<span className="node">Dispute</span>}>
                                <div>Resolve Dispute</div>
                            </TreeView>
                        </TreeView>
                    </TreeView>
                </TreeView>
                <div>Grade Problem 2</div>
            </TreeView>
        </div>;
    }

    /*render() {
        return <div className="card">
            <TreeView nodeLabel={<a href="http://localhost:4001/task/1675" target="_blank"><span className="node">Create Problem 1</span></a>}>
                <TreeView nodeLabel={<a href="http://localhost:4001/task/1675" target="_blank"><span className="node">Revise 1</span></a>}>
                    <TreeView nodeLabel={<span className="node">Needs Consolidation</span>}>
                        <div>Consolidate revise</div>
                    </TreeView>
                </TreeView>
                <div>Revise 1</div>
            </TreeView>
            <TreeView nodeLabel={<a href="http://localhost:4001/task/1675" target="_blank"><span className="node">Create Problem 2</span></a>}>
                <div>Revise 2</div>
                <TreeView nodeLabel={<span className="node">Solve 2</span>}>
                    <TreeView nodeLabel={<span className="node">Grade Solve 2</span>}>
                        <TreeView nodeLabel={<span className="node">Needs Consolidation</span>}>
                            <TreeView nodeLabel={<span className="node">Consolidate</span>}>
                                <TreeView nodeLabel={<span className="node">Dispute</span>}>
                                    <div>Resolve Dispute</div>
                                </TreeView>
                                <div>Grade Consolidate</div>
                            </TreeView>
                        </TreeView>
                    </TreeView>
                    <div>Grade Solve 2</div>
                </TreeView>
                <TreeView nodeLabel={<span className="node">Create Problem 3</span>}>
                    <div>Solve 3</div>
                </TreeView>
                <TreeView nodeLabel={<span className="node">Grade Problem 2</span>}>
                    <TreeView nodeLabel={<span className="node">Needs Consolidation</span>}>
                        <TreeView nodeLabel={<span className="node">Consolidate</span>}>
                            <TreeView nodeLabel={<span className="node">Dispute</span>}>
                                <div>Resolve Dispute</div>
                            </TreeView>
                        </TreeView>
                    </TreeView>
                </TreeView>
                <div>Grade Problem 2</div>
            </TreeView>
        </div>;
    }*/
}

export default TreeComponent;