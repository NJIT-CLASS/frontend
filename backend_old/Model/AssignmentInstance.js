module.exports = function(sequelize, DataTypes) {
    return sequelize.define('AssignmentInstance', {
        AssignmentInstanceID: {
            //Assignment instance ID
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        AssignmentID: {
            //identifier for Assignment (activity)
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentID',
            allowNull: false
        },
        SectionID: {
            //identifier for a section.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false
        },
        StartDate: {
            //Start date for the assignment. 0 means start immediately.
            type: DataTypes.DATE,
            field: 'StartDate',
            allowNull: true
        },
        EndDate: {
            //Overall end date for all the workflows associated to this assignment to finish.
            type: DataTypes.DATE,
            field: 'EndDate',
            allowNull: true
        },
        WorkflowCollection: {
            //Array of workflow instance ids corresponding to this assignment instance.
            type: DataTypes.JSON,
            field: 'WorkflowCollection',
            allowNull: true
        },
        WorkflowTiming: {
            //Array of arrays of workflow instance and task instance timing parameters
            type: DataTypes.JSON,
            field: 'WorkflowTiming',
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
        tableName: 'AssignmentInstance'
    });
};
