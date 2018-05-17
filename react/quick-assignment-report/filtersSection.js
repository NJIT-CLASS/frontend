import React, { Component } from 'react';
import Select from 'react-select';
import {TASK_TYPES} from '../../server/utils/react_constants';
import {sortBy} from 'lodash';

// This component renders the filters on the Assignment Status page.
const FilterSection = ({
    showAnonymousVersion, 
    hasInstructorPrivilege, 
    Filters, 
    onChangeFilterType, 
    onChangeFilterStatus, 
    onChangeFilterUsers, 
    Strings, 
    users, 
    taskActivities
}) => {
    // The type filter filters by task activity ID. It shows the task activity's 
    // name along with the name of the workflow activity it belongs to.
    const typeOptions = taskActivities.map(ta => ({
        value: ta.taskActivityID,
        label: `${ta.workflowActivityName} - ${ta.taskActivityDisplayName}`
    }));
    const typeFilter = (
        <Select
          options={typeOptions}
          onChange={onChangeFilterType}
          value={Filters.Type}
          autosize={true}
          className={'inline-filters'}
          searchable={false}
          placeholder={Strings.TaskType}
          clearable={true}
          multi={true}
        />
      );


    // The status filter filters by task status.
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
    const statusFilter = (
      <Select
        options={statusOptions}
        onChange={onChangeFilterStatus}
        value={Filters.Status}
        className={'inline-filters'}
        clearable={true}
        backspaceRemoves={false}
        searchable={false}
        autosize={true}
        multi={true}
        placeholder={'Status'}/>
      );


    // The users filter filters by user ID. Only users with instructor privileges can
    // see it.
    const userOptions = sortBy(users, user => user.id)
        .map(user => ({
            value: user.id,
            label: `${user.id} - ${user.firstName} ${user.lastName} - ${user.email}`
        }));
    const userFilter = (
        hasInstructorPrivilege ?
            <Select
              options={userOptions}
              onChange={onChangeFilterUsers}
              value={Filters.Users}
              autosize={true}
              className={'inline-filters'}
              searchable={true}
              placeholder={'User'}
              clearable={true}
              multi={true}
            />
            : null
    );

    return (
        <div>
            {typeFilter}
            {statusFilter}
            {userFilter}
        </div>
    );

};

export default FilterSection;
