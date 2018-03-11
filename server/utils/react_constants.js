const path = require('path');

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
},
{
    language: ' ελληνικά',
    locale: 'el'
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

export const ROLES = {
    GUEST: 'Guest',
    PARTICIPANT: 'Participant',
    TEACHER: 'Teacher',
    ENHANCED: 'Enhanced',
    ADMIN: 'Admin',
    SYSTEM: 'System Role',
    'Guest': 1,
    'Participant': 2,
    'Teacher': 3,
    'Enhanced': 4,
    'Admin': 5

};

export const canRoleAccess = function(userRole, requiredRole){
    console.log(ROLES[userRole], ROLES[requiredRole]);
    if(ROLES[userRole] >= ROLES[requiredRole]){
        return true;
    } else {
        return false;
    }
};