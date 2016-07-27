module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Section', {
        SectionID: {
            //Unique identifier for the section
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        SemesterID: {
            //Unique identifier for the semester
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SemesterID',
            allowNull: false,
        },
        CourseID: {
            //Unique identifier for the course
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CourseID',
            allowNull: false
        },
        OrganizationID: {
            //Unique identifier for the organization
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OrganizationID',
            allowNull: false
        },
        Name: {
            //Name of the section (e.g. 001,002,h01)
            type: DataTypes.STRING(100),
            field: 'Name',
            allowNull: true
        },
        StartDate: {
            //Beginning date for this section
            type: DataTypes.DATE,
            field: 'StartDate',
            allowNull: true
        },
        EndDate: {
            //Ending date for this section
            type: DataTypes.DATE,
            field: 'EndDate',
            allowNull: true
        },
        Description: {
            //Description of the course (Day Assignment, night Assignment, weekend university)
            type: DataTypes.STRING,
            field: 'Description',
            allowNull: true
        }
        // Roster: {
        //     //Array of users in the course
        //     type: DataTypes.BLOB,
        //     field: 'Roster',
        //     allowNull: true // current not used in the system might change later
        // },
        // GroupList: {
        //     //Array of groups in the course
        //     type: DataTypes.BLOB,
        //     field: 'GroupList',
        //     allowNull: true // current not used in the system might change later
        // }

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
        tableName: 'Section'
    });
};
