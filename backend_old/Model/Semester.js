module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Semester', {
        SemesterID: {
            //Unique identifier for the semester
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SemesterID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        OrganizationID: {
            //Unique identifier for the organization
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OrganizationID',
            allowNull: false
        },
        Name: {
            //Name of the semester (e.g. Fall2017,Winter2016)
            type: DataTypes.STRING(25),
            field: 'Name',
            allowNull: true
        },
        StartDate: {
            //Start date of the semester
            type: DataTypes.DATE,
            field: 'StartDate',
            allowNull: true
        },
        EndDate: {
            //End date of the semester
            type: DataTypes.DATE,
            field: 'EndDate',
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
        tableName: 'Semester'
    });
};
