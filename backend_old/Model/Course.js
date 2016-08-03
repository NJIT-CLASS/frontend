module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Course', {
        CourseID: {
            //Unique identifier for the course
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CourseID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        Number: {
            //Number of the course (e.g. Chem101,Math101)
            type: DataTypes.STRING(50),
            field: 'Number',
            allowNull: true
        },
        Name: {
            //Name of the course
            type: DataTypes.STRING(150),
            field: 'Name',
            allowNull: true
        },
        OrganizationID: {
            //Unique identifier for the organization
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OrganizationID',
            allowNull: false
        },
        CreatorID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CreatorID',
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
        tableName: 'Course'
    });
};
