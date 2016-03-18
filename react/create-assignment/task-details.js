import React from 'react';

class TaskDetails extends React.Component {
	
	render(){
		return (
			<div className="container">
            	<div className="section">
                	<h3 className="title">Create Problem</h3>
            		<div className="section-content">
                        <label>Task Name</label>
                        <div>
                            <input type="text"></input>
                        </div>

                    	<a className="link">Advanced Options</a>
                     </div>
            	</div>
            	<div className="section">
                	<h3 className="title">Task Subworkflows</h3>
            		<ul>
            			<li>Subworkflow 1</li>
            			<li>Subworkflow 2</li>
            		</ul>
            	</div>
            </div>
		)
	}
}

export default TaskDetails;
