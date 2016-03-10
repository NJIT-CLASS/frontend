import React from 'react';

class TaskForm extends React.Component {
	
	render(){
		return (
			<div>
				<div className="container">
                	<div className="section">
                    	<h3 className="title">Create Problem</h3>
                		<div className="section-content">
	                        <label>Task Name</label>
	                        <div>
	                            <input type="text"></input>
	                        </div>

                        	<label>When is the task be due?</label>
	                        <div>
	                        	<div>
			                        <input type="radio" name="option" onClick={this.viewfn}> Number of Days ?</input>
			                    </div>
			                    <div>
			                        <input type="radio" name="option"> Specfific Date ?</input>
			                    </div>
			                    <div>
			                        <button type="submit"> Next</button>
			                    </div>
	                        </div>
	                     </div>
                	</div>
                </div>
			</div>
		)
	}
}

export default TaskForm