import React from 'react';


class ErrorComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
      return (<div className = "section error animate fadeInUp" >
            <h2 className = "title" >Error</h2>
          < div className = "section-content section-header animate" >
            < div name = "course-title" className = "regular-text" ><div className="placeholder"></div> An error has occured while loading the task. Sorry about that. < /div >
            </div>

      </div >);
    }

}

export default ErrorComponent;
