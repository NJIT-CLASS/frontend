import {ROLES, canRoleAccess} from '../../utils/react_constants';

exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }

    res.render('./task-status-table', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        assignmentId: req.params.assignmentId,
        hasInstructorPrivilege: canRoleAccess(req.App.user.role, ROLES.TEACHER)
    });
};
