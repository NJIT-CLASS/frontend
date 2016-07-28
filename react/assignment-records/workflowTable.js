import React from 'react';

class WorkflowTable extends React.Component {
  constructor(props){
    super(props);

    this.state={
      Rows: []
    };

  }



  componentWillReceiveProps(){
    let orderedWorkflow = [];
    this.props.workflows.forEach(function(workflow){
      let columns = { "create-problem": null,
                      "edit": null,
                      "solve": null,
                      "grade":null
                    };
      workflow.forEach(function(task){
        columns[task.TaskActivityType] = task;
      });

      orderedWorkflow.push(columns);
    }, this);

    console.log(orderedWorkflow);
    this.setState({
      Rows: orderedWorkflow
    });
    return;

  }

  render(){
    let tablerows = this.state.Rows.map(function(row){
      let cols = row.map(function(key){
        return (<td>
                    <div key={key}>
                      <a href="#"> {row[key].UserName} </a><br/>
                      {"("+ row[key].UserID +")"}
                    </div>
                  </td>);
      },this);

      return (<tr>
                {cols}
              </tr>);
    }, this);

    return (
      <table>
        <tbody>
          {tablerows}
        </tbody>
      </table>

    );
  }

}

WorkflowTable.defaultProps={
    workflows: [[{
      TaskID: 1,
      UserID: 8,
      UserName: "aaa23",
      TaskActivityType: "create_problem",
      Task_status: "Complete",
    },{
      TaskID: 2,
      UserID: 6,
      UserName: "bbb23",
      TaskActivityType: "edit",
      Task_status: "Incomplete",
    }]]
};

export default WorkflowTable;
