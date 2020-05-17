import React, { Component } from 'react';
import Select from 'react-select';
import {TASK_TYPES} from '../../server/utils/react_constants';
import {sortBy, uniqBy} from 'lodash';

// This component renders the filters on the Assignment Status page.
const FilterSection = ({
    showAnonymousVersion, 
    hasInstructorPrivilege, 
    Filters, 
    onChangeFilterTaskType,
    onChangeFilterProblemType,
    onChangeFilterStatus, 
    onChangeFilterUsers, 
    Strings, 
    users, 
    taskActivities
}) => {
    // The problem type filter filters by workflow activity ID. It shows the workflow activity display names.
    let problemTypeOptions = taskActivities.map(ta => ({
        value: ta.workflowActivityID,
        label: ta.workflowActivityName
    }));
    problemTypeOptions = uniqBy(problemTypeOptions, 'value');
    const problemTypeFilter =
        problemTypeOptions.length > 1 ? (
            <Select
              options={problemTypeOptions}
              onChange={onChangeFilterProblemType}
              value={Filters.ProblemType === null ? null : Filters.ProblemType.value}
              className={'inline-filters'}
              searchable={false}
              placeholder={`${Strings.ProblemType} (${problemTypeOptions.length})`}
              clearable={true}
              multi={false}
            />
        ) : null;


    // The task type filter filters by task activity ID and show the task activity display names. If there is more 
    // than one problem type, it only shows the task activities that belong to the problem types selected in the 
    // problem type filter. (The task type filter is disabled if there is more than one problem type and no problem 
    // types are selected in the problem type filter. The user must select a problem type first.)
    const taskTypeOptions = taskActivities
        .filter(ta => Filters.ProblemType == null || Filters.ProblemType.value == ta.workflowActivityID)
        .map(ta => ({
            value: ta.taskActivityID,
            label: ta.taskActivityDisplayName
        }));
    const taskTypeFilter = (
        <Select
          options={taskTypeOptions}
          onChange={onChangeFilterTaskType}
          value={Filters.TaskType}
          className={'inline-filters'}
          searchable={false}
          placeholder={Strings.TaskType}
          clearable={true}
          multi={true}
          disabled={problemTypeOptions.length > 1 && Filters.ProblemType == null}
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
        multi={true}
        placeholder={'Status'}/>
      );


    // The users filter filters by user ID. Only users with instructor privileges can see it.
    const userOptions = sortBy(users, user => user.id)
        .map(user => ({
            value: user.id,
            label: `${user.id} - ${user.email}`
        }));
    const userFilter = (
        hasInstructorPrivilege ?
            <Select
              options={userOptions}
              onChange={onChangeFilterUsers}
              value={Filters.Users}
              className={'inline-filters'}
              searchable={true}
              placeholder={'User'}
              clearable={true}
              multi={true}
            />
            : null
    );

    return (
        <div style={{maxHeight: "55px"}}>
            {problemTypeFilter}
            {taskTypeFilter}
            {statusFilter}
            {userFilter}
        </div>
    );

};

export default FilterSection;
