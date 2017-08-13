import React from "react";
import ReactTable from 'react-table';


class gradeReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({value: value});
  };


  render() {

    const data = [{
      name: 'Tanner Linsley',
      age: 26,
      friend: {
        name: 'Jason Maurer',
        age: 23,
      }
    },{
      name: 'Jason Maurer',
      age: 23,
      friend: {
        name: 'Tanner Linsley',
        age: 26,
      }
    }]

    const columns = [{
      header: 'Name',
      accessor: 'name' // String-based value accessors!
    }, {
      header: 'Age',
      accessor: 'age',
      render: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'friendName',
      header: 'Friend Name',
      accessor: d => d.friend.name // Custom value accessors!
    }, {
      header: props => <span>Friend Age</span>, // Custom header components!
      accessor: 'friend.age'
    }]

    const totalRecords = data.length;

    return (
      <div>
        <ReactTable
        data={data}
        showPagination={false}
        defaultPageSize={totalRecords}
        columns={columns}
      />
  </div>
    );
  }
}

export default gradeReport;
