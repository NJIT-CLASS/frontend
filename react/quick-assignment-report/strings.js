import {TASK_TYPES_TEXT} from '../../server/utils/react_constants';
import React from 'react';

const strings = {
    CreateProblemName: TASK_TYPES_TEXT.CREATE_PROBLEM,
    EditProblemName: TASK_TYPES_TEXT.EDIT,
    CommentName: TASK_TYPES_TEXT.COMMENT,
    SolveProblemName: TASK_TYPES_TEXT.SOLVE_PROBLEM,
    GradeName: TASK_TYPES_TEXT.GRADE_PROBLEM,
    CritiqueName: TASK_TYPES_TEXT.CRITIQUE,
    NeedsConsolidationName: TASK_TYPES_TEXT.NEEDS_CONSOLIDATION,
    ConsolidateName: TASK_TYPES_TEXT.CONSOLIDATION,
    DisputeName: TASK_TYPES_TEXT.DISPUTE,
    ResolveDisputeName: TASK_TYPES_TEXT.RESOLVE_DISPUTE,
    Viewed: 'Opened',
    Complete: 'Complete',
    Late: 'Late',
    Cancelled: 'Cancelled',
    NotYetStarted: 'Not yet pending',
    Started: 'Pending',
    Bypassed: 'Bypassed',
    Automatic: 'Automatic',
    TaskType: 'Task Type',
    ProblemType: 'Problem Type',
    WorkflowID: 'WorkflowID',
    ReplaceInAssignmentTooltip: 'This button will open a form for replacing users in the assignment',
    RemoveProblemThreadsTooltip: `<p>This button will reveal checkboxes next to each problem thread. 
        Use them to select problem threads to remove.</p>`,
    WorkflowActivitySingleProblemTooltip: `<p>To the left is the internal ID and name of this assignment's problem type.
        Below are all of the problem threads grouped for this problem type.</p>`,
    WorkflowActivityMultipleProblemTooltip: `<p>This assignment has multiple problem types.
        To the left is the internal ID and name of one of these problem types.
        Below are all of the problem threads grouped for this problem type.</p>`,
    WorkflowInstanceTooltip: `<p>Each row shows all of the tasks for one of the problem threads 
            and their current status. The internal problem thread ID is at the start of the row.
            Hover over any task for more options.<p>`,
    ViewedTooltip: 'The task has been opened and viewed by the student.',
    CompleteTooltip: 'The task has been completed and submitted by the student.',
    LateTooltip: 'The task is past its due date',
    CancelledTooltip: 'The task was cancelled and will not start.',
    NotYetStartedTooltip: 'The task has not yet started because previous tasks that it depends on have not been completed.',
    StartedTooltip: 'The task has started and is awaiting completion by the student.',
    BypassedTooltip: 'The task was skipped and the next task was started.',
    AutomaticTooltip: 'The task will be completed automatically.',
    RemoveSelectedProblemThreadsTooltip:
        `Click to remove the checked problem threads.
        Removing a problem thread will cancel all of its tasks.
        The users will be shuffled to ensure that they all have an even number of tasks assigned to them.
        You can only remove problem threads without any completed tasks.
        It is most efficent to remove multiple problem threads at once instead of doing this individually.</p>`,
    NumberOfSetsTooltip: 'This is the number of problems of this type that each student creates/solves. All of them are included among the problem threads below.',
    DescriptionTooltip: 
        `These are all the problem threads in which you have a task.  
        You can view some of the completed tasks by clicking on them, 
        though some may not be accessible until the problem thread has been entirely completed, 
        or ready for you to finish one of its later tasks.`
};

export default strings;
