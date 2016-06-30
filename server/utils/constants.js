const path = require('path');

var fallbackSettings;

try {
    fallbackSettings = require('../../fallback_settings');
} catch (e) {}

exports.FRONTEND_PORT = process.env.CLASS_PORT || fallbackSettings.FRONTEND_PORT;
exports.REDIS_SECRET = process.env.CLASS_REDIS_SECRET || fallbackSettings.REDIS_SECRET;
exports.REDIS_HOST = process.env.CLASS_REDIS_HOST || fallbackSettings.REDIS_HOST;
exports.REDIS_PORT = process.env.CLASS_REDIS_PORT || fallbackSettings.REDIS_PORT;
exports.REDIS_AUTH = process.env.CLASS_REDIS_AUTH || fallbackSettings.REDIS_AUTH;
exports.API_URL = process.env.API_URL || fallbackSettings.API_URL;

exports.ROOT_DIRECTORY_PATH = path.resolve(__dirname, '../');

exports.TASK_TYPES = {
    CREATE_PROBLEM: 'create_problem',
    EDIT:'edit',
    COMMENT:'comment',
    REVISE_AND_RESUBMIT:'revise_and_resubmit',
    SOLVE_PROBLEM:'solve_problem',
    GRADE_PROBLEM: 'grade_problem',
    CRITIQUE:'critique',
    GRADED:'graded',
    NEEDS_CONSOLIDATION: 'needs_consolidation',
    CONSOLIDATION:'consolidation',
    DISPUTE:'dispute',
    RESOLVE_DISPUTE:'resolve_dispute',
    COMPLETED: 'completed'
};

exports.TASK_TYPE_TEXT = {
    create_problem: 'Create Problem',
    edit:'Edit',
    comment:"Comment",
    revise_and_resubmit: 'Revise and Resubmit',
    solve_problem: 'Solve problem',
    grade_problem: 'Grade',
    critique:'Critique',
    graded:'Grades',
    needs_consolidation: "Needs Consolidation",
    consolidation:'Consolidation',
    dispute:'Dispute',
    resolve_dispute:'Resolve Dispute',
    completed:'Completed Task'
};
