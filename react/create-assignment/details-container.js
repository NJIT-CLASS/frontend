import React from 'react';

// import Details from './details';
// import WorkflowList from './workflows';

class DetailsContainer extends React.Component {
    addWorkflow() {
        this.props.selectWorkflow();
    }

    render() {
        return (
            <div className="container">
                <div className="section">
                    <h3 className="title">Details</h3>
                    <div className="section-content">
                        <label>Name</label>
                        <div>
                            <input type="text"></input>
                        </div>

                        <label>Description</label>
                        <div>
                            <textarea></textarea>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <h3 className="title">Workflows</h3>
                    <ul>
                        <li>Workflow 1</li>
                        <li>Workflow 2</li>
                        <li onClick={this.addWorkflow.bind(this)}>Add New Workflow</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default DetailsContainer;
