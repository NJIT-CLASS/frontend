import React from 'react';
import Checkbox from '../shared/checkbox';
import Select from 'react-select';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';

// const TableCell = ({nameSuffix,status,options,changeSelectedStatus, render}) => {
const TableCell = (props) => {

 // console.log({status,options,changeSelectedStatus, render});
 // console.log(props.status.row.UserID);

// var options = [
// 			{ label: ' Rejected', value: 'Rejected', color: '#ff2e00' },
// 			{ label: ' Pending', value: 'Pending', color: '#ffbf00' },
// 			{ label: ' Approved', value: 'Approved', color: '#57d500' },
//       { label: ' Instructor Assigned', value: 'Assigned', color: '#4D4DFF' }
// 		];
   var name = '';
	 name = props.status.row.UserID + props.nameEnd;
    console.log("name: ",name);


  // <span>
  //   <span style={{
  //     color: status.value === 'Rejected' ? '#ff2e00'
  //       : status.value === 'Pending' ? '#ffbf00'
  //       : status.value === 'Approved' ? '#57d500'
  //       : status.value === 'Voluntold' ? '#002eff'
  //       : '#ffffff',
  //     transition: 'all .3s ease'
  //   }}>
  //     &#x25cf;
  //   </span> {
  //     status.value === 'Rejected' ? `Rejected`
  //     : status.value === 'Pending' ? `Pending`
  //     : status.value === 'Approved' ? `Approved`
  //     : status.value === 'Voluntold' ? `Voluntold`
  //     : ''
  //   }
  // </span>

  return (
    <div>
      <Select name={name} options={props.options} optionRenderer={this.renderOption} value={this.status.value} valueRenderer={this.renderValue} onChange={props.changeSelectedStatus.bind(this,props)} />
    </div>
  );
}

export default TableCell;
