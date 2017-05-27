import React, { Component } from 'react';
import Select from 'react-select';

const FilterSection = ({Filters, changeFilterType, changeFilterStatus, changeFilterWorkflowID}) => {
    const typeOptions = [{value: '', label: 'Task Type'}, {value: 'grade_problem', label: 'grade_problem'}];
    const statusOptions = [{value: 'Incomplete', label:'Incomplete'},
    {value: 'complete', label: 'Complete'},
    {value: 'Late', label: 'Late'},
    {value: 'Not Needed', label: 'Not Needed' },
    {value: 'not_yet_started', label: 'Not yet started'},
    {value: 'started', label: 'Started'},
    {value: 'bypassed', label: 'Bypassed'},
    {value: 'automatic', label: 'Automatic'}];
    const workflowOptions = [{value:'', label: 'WorkflowID'}];

    const typeFilter = (
        <Select  options={typeOptions}
          onChange={changeFilterType}
          value={Filters.Type}
          autosize={true}
          clearable={false}
          className={'inline-filters'}
          searchable={false} />
      );

    const workflowFilter = (
        <Select options={workflowOptions}
            onChange={changeFilterWorkflowID}
            value={Filters.WorkflowID}
            className={'inline-filters'}
            autosize={true}
            clearable={false}
            searchable={false} />
        );

    const statusFilter = (
      <Select options={statusOptions}
        onChange={changeFilterStatus}
        value={Filters.Status}
        className={'inline-filters'}
        clearable={true}
        backspaceRemoves={false}
        searchable={false}
        autosize={true}
        multi={true}/>
      );

    return <div>
    {typeFilter}
    {statusFilter}
    {workflowFilter}
  </div>;

};

export default FilterSection;
