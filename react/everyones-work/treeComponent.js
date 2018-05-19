import React, { Component, Children } from 'react';

import TreeView from 'react-treeview';
import apiCall from '../shared/apiCall';
var TreeModel = require('tree-model'); /// references: http://jnuno.com/tree-model-js/  https://github.com/joaonuno/tree-model-js
let FlatToNested = require('flat-to-nested');

class TreeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflow: null,
            WorkflowStructure: null
        };
        this.tree = new TreeModel(); //this is the tree making object. It is not a tree structure but has the tree methods
        
    }

    unflattenTreeStructure(flatTreeArray){
        if( typeof flatTreeArray == 'string') flatTreeArray = JSON.parse(flatTreeArray);
        let flatToNested = new FlatToNested();
        let nestedTreeObj = flatToNested.convert(flatTreeArray);
        let treeRoot = this.tree.parse(nestedTreeObj);
        return treeRoot;
    }

    makeTreeView(node){
        if(node == null || node.model.id == -1 || node.Tasks == undefined) return <span></span>;
        let nodeLink = <a href={'/task/'+node.Tasks[0].TaskInstanceID} target="_blank"><span className="node">{node.Tasks[0].TaskActivity.DisplayName}</span></a>;
        let nodeChildrenTrees = [];
        if(node.children.length != 0){
            nodeChildrenTrees = node.children.map( x=>this.makeTreeView(x));
        }
        let treeViewElement =  <TreeView nodeLabel={nodeLink}>
            {nodeChildrenTrees}
        </TreeView>;

        return treeViewElement;
    }

    componentDidMount() {
        apiCall.get(`/EveryonesWork/alternate/${this.props.AssignmentID}`, (err, res, body) => {
            console.log(body);
            const firstKey = Object.keys(body.Workflows)[0];
            let treeArray = body.Workflows[firstKey].Structure;
            let workflowInstanceSelected = body.Workflows[firstKey].WorkflowInstances.filter(x => x.WorkflowInstanceID == this.props.WorkflowID)[0];
            let tasksForStructure = workflowInstanceSelected.Tasks;
            let taskInvertedByActivityID = {};

            tasksForStructure.forEach(taskInstance => {
                let currentTaskActivityID = taskInstance.TaskActivity.TaskActivityID;
                if(taskInvertedByActivityID[currentTaskActivityID] == undefined){
                    taskInvertedByActivityID[currentTaskActivityID]  = [ taskInstance];
                } else {
                    taskInvertedByActivityID[currentTaskActivityID].push(taskInstance);
                }
            });
            console.log(treeArray);
            
            const treeStructure = this.unflattenTreeStructure(treeArray);
            treeStructure.walk({strategy: 'pre'},node => {
                node.Tasks = taskInvertedByActivityID[node.model.id];
            }, this);
            debugger;


            this.setState({
                WorkflowStructure: treeStructure
            });
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
            {/*this.makeTreeView(this.state.WorkflowStructure)*/}
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