const constants = require('../../server/utils/constants');

export const TASK_TYPES = {
    CREATE_PROBLEM: constants.TASK_TYPES.CREATE_PROBLEM,
    GRADE_PROBLEM: constants.TASK_TYPES.GRADE_PROBLEM,
    SOLVE_PROBLEM:constants.TASK_TYPES.SOLVE_PROBLEM,
    EDIT: constants.TASK_TYPES.EDIT,
    REVISE_AND_RESUBMIT:constants.TASK_TYPES.REVISE_AND_RESUBMIT,
    CRITIQUE:constants.TASK_TYPES.CRITIQUE,
    DISPUTE: constants.TASK_TYPES.DISPUTE,
    CONSOLIDATION:constants.TASK_TYPES.CONSOLIDATION,
    RESOLVE_DISPUTE: constants.TASK_TYPES.RESOLVE_DISPUTE,
    COMPLETED: constants.TASK_TYPES.RESOLVE_DISPUTE.COMPLETED
};

export const TASK_TYPE_TEXT = {
    create_problem: constants.TASK_TYPE_TEXT.create_problem,
    grade_problem: constants.TASK_TYPE_TEXT.grade_problem,
    solve_problem: constants.TASK_TYPE_TEXT.solve_problem,
    edit: constants.TASK_TYPE_TEXT.edit,
    revise_and_resubmit: constants.TASK_TYPE_TEXT.revise_and_resubmit,
    critique:constants.TASK_TYPE_TEXT.critique,
    dispute:constants.TASK_TYPE_TEXT.dispute,
    consolidation: constants.TASK_TYPE_TEXT.consoltidation,
    resolve_dispute:constants.TASK_TYPE_TEXT.resolve_dispute,
    completed: constants.TASK_TYPE_TEXT.completed,
};
