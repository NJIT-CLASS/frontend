import React, { Component } from 'react';
import Select from 'react-select';
import {TASK_TYPES} from '../../server/utils/react_constants';

const FilterSection = ({Filters, changeFilterType, changeFilterStatus, Strings}) => {
    const typeOptions = [{value: '', label: Strings.TaskType},
    {value: TASK_TYPES.CREATE_PROBLEM ,label: Strings.CreateProblemName},
    {value: TASK_TYPES.EDIT,label: Strings.EditProblemName},
    {value: TASK_TYPES.SOLVE_PROBLEM ,label: Strings.SolveProblemName},
    {value: TASK_TYPES.GRADE_PROBLEM ,label: Strings.GradeName},
    {value: TASK_TYPES.CRITIQUE ,label: Strings.CritiqueName},
    {value: TASK_TYPES.NEEDS_CONSOLIDATION ,label: Strings.NeedsConsolidationName},
    {value: TASK_TYPES.CONSOLIDATION ,label: Strings.ConsolidateName},
    {value: TASK_TYPES.DISPUTE,label: Strings.DisputeName},
    {value: TASK_TYPES.RESOLVE_DISPUTE ,label: Strings.ResolveDisputeName},
    ];

    const statusOptions = [{value: 'Incomplete', label:Strings.Incomplete},
    {value: 'complete', label: Strings.Complete},
    {value: 'Late', label: Strings.Late},
    {value: 'Not Needed', label: Strings.NotNeeded },
    {value: 'not_yet_started', label: Strings.NotYetStarted},
    {value: 'started', label: Strings.Started},
    {value: 'bypassed', label: Strings.Bypassed},
    {value: 'automatic', label: Strings.Automatic}];
    const workflowOptions = [{value:'', label: Strings.WorkflowID}];

    const typeFilter = (
        <Select  options={typeOptions}
          onChange={changeFilterType}
          value={Filters.Type}
          autosize={true}
          clearable={false}
          className={'inline-filters'}
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
        multi={true}
        placeholder={'Status'}/>
      );

    return <div>
      {typeFilter}
      {statusFilter}
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
