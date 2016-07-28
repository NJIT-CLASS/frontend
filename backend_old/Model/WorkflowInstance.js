module.exports = function(sequelize, DataTypes) {
    return sequelize.define('WorkflowInstance', {
        WorkflowInstanceID: {
            //Unique identifier for the workflow instance.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowInstanceID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        WorkflowActivityID: {
            //Unique identifier for workflow activity.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowActivityID',
            allowNull: false
        },
        AssignmentInstanceID: {
            //Unique identifier for assignment instance
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false
        },
        StartTime: {
            //Start date of the workflow instance
            type: DataTypes.DATE,
            field: 'StartTime',
            allowNull: true
        },
        EndTime: {
            //Scheduled end date of the workflow instance
            type: DataTypes.DATE,
            field: 'EndTime',
            allowNull: true
        },
        TaskCollection: {
            //Array of task instance ids corresponding to this workflow instance.
            type: DataTypes.JSON,
            field: 'TaskCollection',
            allowNull: true
        },
        Data: {
            //Any data for the workflow instance instead of tasks. (Not currently used.)
            type: DataTypes.JSON,
            field: 'Data',
            allownull: true
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
        tableName: 'WorkflowInstance'
    });
};
