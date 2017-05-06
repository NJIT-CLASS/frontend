const path = require('path');

var fallbackSettings;

try {
    fallbackSettings = require('../../fallback_settings');
} catch (e) {}

//Frontend Server Settings (MODIFY frontend_setting.js instead of here)
exports.FRONTEND_PORT = process.env.CLASS_PORT || fallbackSettings.FRONTEND_PORT;
exports.REDIS_SECRET = process.env.CLASS_REDIS_SECRET || fallbackSettings.REDIS_SECRET;
exports.REDIS_HOST = process.env.CLASS_REDIS_HOST || fallbackSettings.REDIS_HOST;
exports.REDIS_PORT = process.env.CLASS_REDIS_PORT || fallbackSettings.REDIS_PORT;
exports.REDIS_AUTH = process.env.CLASS_REDIS_AUTH || fallbackSettings.REDIS_AUTH;
exports.API_URL = process.env.API_URL || fallbackSettings.API_URL;
exports.ROOT_DIRECTORY_PATH = path.resolve(__dirname, '../');

//Language Options
exports.LANGUAGES = [{
    language: 'English',
    locale: 'en'
}, {
    language: 'Español',
    locale: 'es'
}, {
    language: 'Français',
    locale: 'fr'
},
{
    language: 'Português',
    locale: 'pt'
}];


//Define all Task Types and their names
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

exports.TASK_TYPES_TEXT = {
    CREATE_PROBLEM: 'Create Problem',
    EDIT:'Edit',
    COMMENT:'Comment',
    REVISE_AND_RESUBMIT: 'Revise and Resubmit',
    SOLVE_PROBLEM: 'Solve Problem',
    GRADE_PROBLEM: 'Grade',
    CRITIQUE:'Critique',
    GRADED:'Grades',
    NEEDS_CONSOLIDATION: 'Needs Consolidation',
    CONSOLIDATION:'Consolidation',
    DISPUTE:'Dispute',
    RESOLVE_DISPUTE:'Resolve Dispute',
    COMPLETED:'Completed Task'
};
