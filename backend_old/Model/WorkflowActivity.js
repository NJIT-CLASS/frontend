module.exports = function(sequelize, DataTypes) {
    return sequelize.define('WorkflowActivity', {
        WorkflowActivityID: {
            //Unique identifier for the workflow activity
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowActivityID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        AssignmentID: {
            //WA_A_id
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentID',
            allowNull: false
        },
        TaskActivityCollection: {
            //Array of task activities related to a workflow. First task of the array will be the starting task.
            type: DataTypes.JSON,
            field: 'TaskActivityCollection',
            allowNull: true
        },
        Name: {
            //Name of the workflow [case1,case2]
            type: DataTypes.STRING(30),
            field: 'Name',
            allowNull: true
        },
        Type: {
          //type of WorkflowActivity (essay question, multiple choice,...).
            type: DataTypes.STRING(40),
            field: 'Type',
            allowNull: true
        },
        GradeDistribution: {
            type: DataTypes.JSON,
            field: 'GradeDistribution',
            allowNull: true
        },
        NumberOfSets:{
          type: DataTypes.INTEGER.UNSIGNED,
          field: 'NumberOfSets',
          allowNull: true
        },
        Documentation: {
            //Description of the typeof workflow
            type: DataTypes.STRING(100),
            field: 'Documentation',
            allowNull: true
        },
        GroupSize: {
            //Specifies the size for the groups. The value of 1 means no groups
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'GroupSize',
            allowNull: true,
            defaultValue: 1
        },
        StartTaskActivity:{ //Not currently used.
            type: DataTypes.JSON,
            field: 'StartTaskActivity',
            allowNull: true
        },
        VersionHistory:{
          type: DataTypes.JSON,
          field: 'VersionHistory',
          allowNull: true
        }
    }, {
        timestamps: false,

        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: true,

        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,

        // define the table's name
        tableName: 'WorkflowActivity'
    });
};
