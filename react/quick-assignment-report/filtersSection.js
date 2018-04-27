import React, { Component } from 'react';
import Select from 'react-select';
import {TASK_TYPES} from '../../server/utils/react_constants';

const FilterSection = ({Filters, changeFilterType, changeFilterStatus, changeFilterUsers, Strings, users, taskActivities}) => {
    const typeOptions = taskActivities.map(taskActivity => ({
        value: taskActivity.TaskActivityID,
        label: taskActivity.DisplayName
    }));

    const statusOptions = [
        {value: 'viewed', label: Strings.Viewed},
        {value: 'complete', label: Strings.Complete},
        {value: 'late', label: Strings.Late},
        {value: 'cancelled', label: Strings.Cancelled},
        {value: 'not_yet_started', label: Strings.NotYetStarted},
        {value: 'started', label: Strings.Started},
        {value: 'bypassed', label: Strings.Bypassed},
        {value: 'automatic', label: Strings.Automatic}
    ];

    const userOptions = users.map(user => ({
        value: user.id,
        label: `${user.id} - ${user.firstName} ${user.lastName} - ${user.email}`
    }));

    const workflowOptions = [{value:'', label: Strings.WorkflowID}];

    const typeFilter = (
        <Select  options={typeOptions}
          onChange={changeFilterType}
          value={Filters.Type}
          autosize={true}
          className={'inline-filters'}
          searchable={false}
          placeholder={Strings.TaskType}
          clearable={true}
          multi={true}
        />
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
        multi={true}
        placeholder={'Status'}/>
      );

    const userFilter = (
        <Select  options={userOptions}
          onChange={changeFilterUsers}
          value={Filters.Users}
          autosize={true}
          className={'inline-filters'}
          searchable={true}
          placeholder={'User'}
          clearable={true}
          multi={true}
        />
      );

    return <div>
      {typeFilter}
      {statusFilter}
      {userFilter}
  </div>;

};

export default FilterSection;

// const workflowFilter = (
//     <Select options={workflowOptions}
//         onChange={changeFilterWorkflowID}
//         value={Filters.WorkflowID}
//         className={'inline-filters'}
//         autosize={true}
//         clearable={false}
//         searchable={false} />
//     );
//
//     {workflowFilter}
