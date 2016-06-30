import React from 'react';

class AssignmentDetailsComponent extends React.Component{
    constructor(props){
      super(props);

      this.state = {

      };
    }

    render(){
      let style={marginRight: "10px",
                marginLeft:'10px'};
      let instyle = {display: "inline-block"};
      let numericInputStyle = {
                                  input: {
                                    height:'40px !important',
                                    width:'120px',
                                    marginLeft: '10px',
                                    marginRight: '10px',
                                    padding:'0px',
                                    marginBottom:'0px',
                                    marginTop:'0px'

                                  },
                                  btnUp: {
                                      height: '37px',
                                       borderRadius: '2px 2px 0 0',
                                       borderWidth : '1px 1px 0 1px',
                                       marginRight: '10px',
                                       marginTop: '10px'
                                   },

                                   btnDown: {
                                      marginTop: '10px',
                                      marginLeft:'10px',
                                       height: '37px',
                                       borderRadius: '0 0 2px 2px',
                                       borderWidth : '0 1px 1px 1px'
                                   }
                                };
      return (
        <div className="section task-hiding">
          <h2 className="title" > Assignment Parameters</h2>
          <div className="section-content">
            <div className="inner"></div>




          </div>
        </div>
      );
    }
}

export default AssignmentDetailsComponent;
