const strings = {
    AssignmentGrades: 'Assignment Grades',
    Assignment: 'Assignment',
    StudentInformation: 'Student Information',
    RegularTasks: 'Regular Tasks',
    ExtraCreditTasks: 'Extra Credit Tasks',
    Email: 'Email',
    LastName: 'Last Name',
    FirstName: 'First Name',
    Total: 'Total',
    CompletenessGrade: 'Completeness Grade',
    Grade: 'Current Grade',
    QualityGrade: 'Quality Grade',
    FinalGrade: 'Final Grade',
    Comments: 'Comments',
    ECCompletenessGrade: 'Extra Credit Completeness Grade',
    ECQualtiyGrade: 'Extra Credit Qualtiy Grade',
    ECGrade: 'Extra Credit Grade',
    ECComments: 'Extra Credit Comments',
    InstructorReport: 'Instructor Report',
    Student: 'Student',
    Task: 'Task',
    TaskGrade: 'Task Grade',
    Weight: 'Weight',
    CombinedWeight: 'Combined Weight',
    WeightedGrade: 'Weighted Grade',
    UserName: 'UserName',
    AssignmentGrade: 'Current Assignment Grade',
    CurrXCreditTaskGrade: 'Current Extra Credit Task Grades',
    CurrXCreditTimeGrade: 'Current Extra Credit Timeliness Grades',
    NumXCreditTasks: 'Total Number of Extra Credit Tasks Assigned',
    AssignmentGradeNoData: 'No grades available for this assignment',

    AGRHeader: 'Assignment Grades Report',
    PGRHeader: 'Problem Grades Report',
    AECGRHeader: 'Assignment Extra Credit Grades Report',
    PTTGRHeader: 'Problem Task and Timeliness Report',
    TGFRHeader: 'Task Grades Field Report',
    PTGDRGHeader: 'Problem Timeliness Grade Details Report',
    AECTGDRHeader: 'Assignment Extra Credit Timeliness Grades Detail Report',
    AECTRHeader: 'Assignment Extra Credit Tasks Report',
    ECTGFRHeader: 'Extra Credit Task Grade Fields Report',

    Problem: 'Problem',
    ProblemGrade: 'Current Problem Grade',
    ProblemsPerStudent: 'Original # Problems Per Student',
    WeightWithinAssignment: 'Weight Within Assignment',
    ScaledGrade: 'Current Scaled Grade',
    ScaledGradeAssignment: 'Current Scaled Grade Within Assignment',
    ScaledGradeProblem: 'Current Scaled Grade Within Problem',

    ConvertedNumericValue: 'Converted Numeric Value',


    WeightWithinProblem: 'Weight Within Problem',
    ProblemGradeNoData: 'There are no grades for this problem',
    TimelinessGrade: 'Timeliness Grade',
    TimelinessMaximumGrade: 'Timeliness Maximum Grade',

    Field: 'Field',
    Type: 'Type',
    Value: 'Value',
    Max: 'Max',
    WeightWTask: 'Weight Within Task',
    ScaledGradeTask: 'Scaled Grade Within Task',
    TaskGradeNoData: 'There are no grades for this task',

    Status: 'Status',
    DaysLate: 'Days Late',
    PenaltyPerDay: 'Penalty Per Day',
    TotalPenalty: 'Total Penalty',

    ExpandTableColumnsDirections: 'In order to expand the table columns (and thereby expand the table), click and drag on the edge of the column header you wish to expand. If the column is already wide enough to fit the data, widening the column further may initially not appear to widen the table, but if you continue to expand the column, the table will eventually widen (and you can left/right scroll across the page).',



    /**************************  Table tool tips: **************************/
    AGRTooltip: 'This is the top level table for your assignment grade.  Click within table for details.',
    PGRTooltip: 'This table shows (cumulative) NON extra credit grades for each problem type.  Click within table for details.',
    PTTGRTooltip: 'This table shows the task quality and timeliness (lateness) grades for this type of problem.  (Many assignments have only one type of problem.)',
    TFGRTooltip: 'This table shows grade details for each field in the task (not timeliness grades). If multiple grading tasks are shown (each from a different grader), then grading is still in progress and the interim grade will be calculated as the maximum, average or minimum of these task grades.',
    PTGDRTooltip: 'This table shows timeliness (lateness) grades for each task in a single type of problem.  (Many assignments have just one type of problem.)',
    AECGRTooltip: 'This table shows the task quality and timeliness (lateness) grades for all extra credit tasks that could receive a grade. One row is for the assignment\'s extra credit timeliness grade. Click there for details.',
    AECTGDRTooltip: 'This table shows timeliness (lateness) grades for each extra credit task in a problem type.',
    AECTRTooltip: 'This table shows each extra credit task assigned, its current status, and task quality/timeliness grades if a gradable task.  Click within table for details.',


    AGRTooltips_CurrentAssignmentGradeTT: 'Either your interim or final assignment grade. It includes task quality grades and task timeliness (lateness) grades for all NON extra credit tasks only. Click for details.',
    AGRTooltips_TotalNumberofExtraCreditTasksAssignedTT: 'The total number of extra credit tasks you were assigned, if any.  Click for a detailed list.',
    AGRTooltips_CurrentExtraCreditTaskGradesTT: 'Any interim or final task quality grades of your extra credit tasks that could be graded. Click for details.',
    AGRTooltips_CurrentExtraCreditTimelinessGradesTT: 'Any timeliness (lateness) grades for your extra credit tasks.  Click for details.',

    PGRTooltips_ProblemTT: 'Assignments can have one or more types of "problems" to solve.',
    PGRTooltips_CurrentProblemGradeTT: 'Either your interim or final  grade for each type of problem. It includes task quality and timeliness grades for all NON extra credit tasks for each problem type.  Click for details.',
    PGRTooltips_OriginalNumberofProblemsPerStudentTT: 'If > 1, then you have to do multiple problems of this type.',
    PGRTooltips_WeightWithinAssignmentTT: 'Weight for each problem type within the assignment (100% if only one problem type)',
    PGRTooltips_CurrentScaledGradeWithinAssignmentTT: '= Current problem grade* weight within assignment',

    PTTGRTooltips_TaskTT: 'Task name and system ID.  One row is for the problem\'s timeliness grade.This page includes only non- extra credit tasks.Click for details.',
    PTTGRTooltips_ProblemTT: 'Problem name and system ID',
    PTTGRTooltips_CurrentGradeTT: 'Either your interim or final task quality grade. The timeliness row shows the timeliness (lateness) grade for all tasks within the problem. Click for details.',
    PTTGRTooltips_WeightWithinProblemTT: 'Weight for task quality or timeliness grades within this problem type',
    PTTGRTooltips_CurrentScaledGradeWithinProblemTT: '= Current grade * weight within problem',
    PTTGRTooltips_WeightWithinAssignmentTT: 'Weight for this problem type within the assignment',
    PTTGRTooltips_CurrentScaledGradeWithinAssignmentTT: '= Current scaled grade within problem* weight within assignment',

    TGFR_FieldTT: 'Some fields have names and others do not.',
    TGFR_TypeTT: 'types: numeric, rating, pass/fail, label',
    TGFR_ValueTT: 'This is the value that the grader entered into this field.',
    TGFR_MaxTT: 'This is the maximum possible value for this field (FYI NOT necessarily the one that the grader entered). For labels, the max is the last/highest label in the set.',
    TGFR_ConvertedNumericValueTT: 'Pass/Fail is converted to 0 or 100.  Labels are converted based on their position in the set.  The last label in the set gets 100 points and all others get a percentage of this based on how many labels are in the set.',
    TGFR_WeightWithinTaskTT: 'The weight for each field in the task.',
    TGFR_ScaledGradeWithinTaskTT: '= Converted Numeric Value * Weight within task',

    PTGDR_TaskTT: 'Task name and system ID.',
    PTGDR_StatusTT: 'Grading status for each task in this problem type: complete (final), not complete (in progress), not reached (task was not started yet), bypassed (task was skipped and will not receive a timeliness grade), cancelled (task was cancelled  and will not receive a timeliness grade)',
    PTGDR_TimelinessMaximumGrade: 'The higest possible timeliess grade (= 100)',
    PTGDR_DaysLateTT: 'If you were late submitting the task and by how many days.',
    PTGDR_PenaltyPerDayTT: 'How much is deducted from the Timeliness Maximum Grade per day if late',
    PTGDR_TotalPenaltyTT: 'The total penalty for being late.  This is the number of days late multiplied by the penalty per day.',
    PTGDR_TimelinessGradeTT: 'The timeliness grade for this task.  It is the Timeliness Maximum Grade minus the Total Penalty.',


    AECGR_ProblemTT: 'Problem name and system ID. One row is for the assignment\'s extra credit timeliness grade. Click there for details.',
    AECGR_TaskTT: 'Extra credit task name and system ID. One row is for the assignment\'s extra credit timeliness grade. Click there for details.',
    AECGR_CurrentGradeTT: 'Either your interim or final task quality grade. One row shows the cumulative timeliness grade for all extra credit tasks in the assignment. Click for details.',
    AECGR_WeightWithinProblemTT: 'Weight for task grades within this problem type',
    AECGR_CurrentScaledGradeWithinProblemTT: '= Current grade * weight within problem',
    AECGR_WeightWithinAssignmentTT: 'Weight for this problem type within the assignment',
    AECGR_CurrentScaledGradeWithinAssignmentTT: '= Current scaled grade within problem * weight within assignment',


    AECTGDR_ProblemTT: 'Problem name and system ID',
    AECTGDR_TaskTT: 'Extra credit task name and system ID',
    AECTGDR_StatusTT: 'Task grading status: complete (final), not complete (in progress), not reached (task was not started yet), bypassed (task was skipped and will not receive a timeliness grade), cancelled (task was cancelled and will not receive a timeliness grade)',
    AECTGDR_TimelinessMaximumGradeTT: 'The higest possible timeliess grade (= 100)',
    AECTGDR_DaysLateTT: 'If you were late submitting the task and by how many days.',
    AECTGDR_PenaltyPerDayTT: 'How much is deducted from the Timeliness Maximum Grade per day if late',
    AECTGDR_TotalPenaltyTT: 'The total penalty for being late.  This is the number of days late multiplied by the penalty per day.',
    AECTGDR_TimelinessGradeTT: 'The timeliness grade for this task.  It is the Timeliness Maximum Grade minus the Total Penalty.',

    AECTR_ProblemTT: 'Problem name and system ID',
    AECTR_TaskTT: 'Extra credit task name and system ID',
    AECTR_StatusTT: 'Task\'s status: complete (final), not complete (in progress), not reached (task was not started yet), bypassed (task was skipped and will not receive grades), cancelled (task was cancelled and will not receive grades)',
    AECTR_TaskGradeTT: 'Either your interim or final task quality grade, if a gradable task. Click for details.',
    AECTR_TimelinessGradeTT: 'The task timeliness (lateness) grade, if the task has one. Click for details.'

};


export default { ...strings };