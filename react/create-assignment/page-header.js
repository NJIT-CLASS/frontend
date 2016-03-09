import React from 'react';

class PageHeader extends React.Component {
    render() {
        return (
        	<div>
            <div className="page-header">
                <h2>Create Assignment</h2>
            </div>
            	<div className="tab">
				  <ul>
				    <li><a href="#">Option 1</a></li>
				    <li><a href="#">Option 2</a></li>
				    <li><a href="#">Option 3</a></li>
				    <li><a href="#" className="lastO" >Option 4</a></li>
				  </ul>
				  </div>
            </div>


        );
    }
}

export default PageHeader;