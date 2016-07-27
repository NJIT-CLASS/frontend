module.exports = function(sequelize, DataTypes) {
    return sequelize.define('TaskActivity', {
        TaskActivityID: {
            //Unique Identifier for the task activity.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TaskActivityID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        WorkflowActivityID: {
            //TaskActivity_WorkflowActivity_ID
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowActivityID',
            allowNull: false
        },
        AssignmentID: {
            //TaskActivity_Assignment_ID
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentID',
            allowNull: false
        },
        Name: {
            //Name of the task activity (Create question quiz, Create question exam)
            type: DataTypes.STRING(50),
            field: 'Name',
            allowNull: true
        },
        Type: {
            //Grade, Solve, …
            type: DataTypes.STRING(40),
            field: 'Type',
            allowNull: true
        },
        FileUpload: {
            type: DataTypes.BLOB,
            field: 'FileUpload',
            allowNull: true
        },
        DueType: { //* DueType
            //Maximum duration of the task in minutes
            type: DataTypes.JSON,
            field: 'DueType',
            allowNull: true
        },
        StartDelay: { //*StartDelay
            //Earlier start time in minutes. “0” means no delay, do when triggered.
            type: DataTypes.DATE,
            field: 'StartDelay',
            allowNull: true
        },
        AtDurationEnd: {
            //Specifies the desired action to take place after the task maximum duration expires.
            type: DataTypes.JSON,
            field: 'AtDUrationEnd',
            allowNull: true
        },
        WhatIfLate: {
            //drop down menu: Keep same participant, Allocate new participant, Allocate to instructor, Allocate to different group member, Consider resolved; fixed as Consider resolved if TA_at_duration_end = "resolved" (*See Notes document)
            type: DataTypes.STRING,
            field: 'WhatIfLate',
            allowNull: true
        },
        DisplayName: {
            // The default should be a name that makes sense to the user and also conveys our intent, such as “Optionally decide to dispute” for the dispute task.  (*See Notes document)
            type: DataTypes.STRING(25),
            field: 'DisplayName',
            allowNull: true
        },
        Documentation: {
            type: DataTypes.STRING,
            field: 'Documentation',
            allowNull: true
        },
        OneOrSeparate: {
            //displays only for Create Problem - store value as T/F (*See Notes document)
            type: DataTypes.STRING(5),
            field: 'OneOrSeparate',
            allowNull: true
        },
        AssigneeConstraints: {
            //Task assignee constrains are stored here
            type: DataTypes.JSON,
            field: 'AssigneeConstraints',
            allowNull: true
        },
        Difficulty: {
            //this needs to be through through further…   For now this will be an array [No] or [Yes, [ratings_subarray]] where the default is [No], but if they choose yes, then by default the ratings_subarray would be ["Easy", "Medium", "Difficult"]
            type: DataTypes.BLOB,
            field: 'Difficulty',
            allowNull: true
        },
        SimpleGrade: {
            //"exists" or "late" or "off_per_day(%) " or "none"
            type: DataTypes.STRING(20),
            field: 'SimpleGrade',
            allowNull: true
        },
        IsFinalGradingTask:{
          type: DataTypes.BOOLEAN,
          field: 'IsFinalGradingTask',
          allowNull: true
        },
        Instructions: {
            //Intructor’s Intructions for the task
            type: DataTypes.TEXT,
            field: 'Instructions',
            allowNull: true
        },
        Rubric: {
            //Intructor’s rubric (only for grading tasks)
            type: DataTypes.TEXT,
            field: 'Rubric',
            allowNUll: true
        },
        Fields: {
            //array of the following field parameter blocks for each field in the input template:   [[f_display_title, f_content_type, f_requires_justification, f_instructions, f_rubric, f_default_content, f_justification_instructions, f_default_justification], …] (See ASA Flow document for details and defaults.)
            type: DataTypes.JSON,
            field: 'Fields',
            allowNull: true
        },
        //----
        AllowReflection:{
          type: DataTypes.JSON,
          field: 'AllowReflection',
          allowNull: true
        },
        AllowRevision:{
          type: DataTypes.BOOLEAN,
          field: 'AllowRevision',
          allowNull: true
        },
        AllowAssessment:{
          type: DataTypes.STRING,
          field: 'AllowAssessment',
          allowNull: true
        },
        NumberParticipants:{
          type: DataTypes.INTEGER.UNSIGNED,
          field: 'NumberParticipants',
          allowNull: true,
          defaultValue: 1
        },
        TriggerConsolidationThreshold:{
          type: DataTypes.JSON,
          field: 'RefersToWhichTaskThreshold',
          allowNull: true
        },
        FunctionType:{
          type: DataTypes.STRING,
          field: 'FunctionType',
          allowNull: true
        },
        Function:{
          type: DataTypes.TEXT,
          field: 'Function',
          allowNull: true
        },
        AllowDispute:{
          type: DataTypes.BOOLEAN,
          field: 'AllowDispute',
          allowNull: true
        },
        LeadsToNewProblem:{
          type: DataTypes.BOOLEAN,
          field: 'LeadsToNewProblem',
          allowNull: true
        },
        LeadsToNewSolution:{
          type: DataTypes.BOOLEAN,
          field: 'LeadsToNewSolution',
          allowNull: true
        },
        //---
        VisualID: {
            //Unique ID within the Workflow
            type: DataTypes.STRING,
            field: 'VisualID',
            allowNull: true
        },
        VersionHistory: {
            //array of [date modified, user_id] for any changes to anyof this task activity's parameters (when Save button is clicked)
            type: DataTypes.JSON,
            field: 'VersionHistory',
            allowNull: true
        },
        RefersToWhichTask: {
            //TA_id of the referred-to-task as noted here.  (Refers to the prior major task in the (sub)workflow that this task solves, annotates or grades or otherwise is related to – usually the first task in this task’s subworkflow.)  {Note: We may decide to implement, or at least display this in the ASA with the TA_visual_ID for clarity.}
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'RefersToWhichTask',
            allowNull: true
        },
        TriggerCondition: {
            //what condition triggers this task; each is a function that should be executed or null
            type: DataTypes.JSON,
            field: 'TriggerCondition',
            allowNull: true
        },
        PreviousTasks: {
            //Specifies which task activity will follow after this task is finished.
            type: DataTypes.JSON,
            field: 'PreviousTasks',
            allowNull: true
        },
        NextTasks: {
            //Specifies which task activity will follow after this task is finished.
            type: DataTypes.JSON,
            field: 'NextTasks',
            allowNull: true
        }
    }, {
        timestamps: false,

        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: true,

        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updatedat
        underscored: true,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // define the table's name
        tableName: 'TaskActivity'
    });
};
