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
    GRADE_PROBLEM: 'grade_problem',
    SOLVE_PROBLEM:'solve_problem',
    EDIT:'edit',
    REVISE_AND_RESUBMIT:'revise_and_resubmit',
    CRITIQUE:'critique',
    DISPUTE:'dispute',
    CONSOLIDATION:'consolidation',
    NEEDS_CONSOLIDATION: 'needs_consolidation',
    RESOLVE_DISPUTE:'resolve_dispute',
    COMPLETED: 'completed'
};

exports.TASK_TYPE_TEXT = {
    create_problem: 'Create Problem',
    grade_problem: 'Grade Problem',
    solve_problem: 'Solve problem',
    edit:'Edit',
    revise_and_resubmit: 'Revise and Submit',
    critique:'Critique',
    dispute:'Dispute',
    consolidation:'Consolidation',
    needs_consolidation: "Needs Consolidate",
    resolve_dispute:'Resolve Dispute',
    completed:'Completed Task'
};
