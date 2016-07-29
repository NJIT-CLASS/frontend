/*  This component should be rendered whenever an error is detected.
    It simply displays an error message. No state, props or logic.
*/
import React from 'react';

class ErrorComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    /*    Props:
              - none
    */

    render() {
      return (<div className = "section error-component animate fadeInUp" >
            <h2 className = "title" >Error</h2>
          < div className = "section-content section-header animate" >
            < div name = "course-title" className = "regular-text" ><div className="placeholder"></div> An error has occured while loading the task. Sorry about that. < /div >
            </div>

      </div >);
    }

}

export default ErrorComponent;
