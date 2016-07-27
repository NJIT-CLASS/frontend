module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        UserID: {
            //Unique identifier for the user.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        UserContactID: {
            //Unique contact identifier
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserContactID',
            allowNull: false
        },
        UserName: {
            //UserName
            type: DataTypes.STRING(30),
            field: 'UserName',
            allowNull: true
        },
        FirstName: {
            //First name of the user
            type: DataTypes.STRING(40),
            field: 'FirstName',
            allowNull: true
        },
        LastName: {
            //Last name of the user
            type: DataTypes.STRING(40),
            field: 'LastName',
            allowNull: true
        },
        MiddleInitial: {
            //Single Character for the user’s middle initial
            type: DataTypes.STRING(1),
            field: 'MiddleInitial',
            allowNull: true
        },
        Suffix: {
            //User’s suffix
            type: DataTypes.STRING(10),
            field: 'Suffix',
            allowNull: true
        },
        OrganizationGroup: {
            //Array of organization IDs to which the user is part of
            type: DataTypes.JSON,
            field: 'OrganizationGroup',
            allowTrue: true
        },
        UserType: { //**
            //User type either instructor or student
            //Instructor Boolean?????
            type: DataTypes.STRING,
            allowNull: true,
            field: 'UserType',
            validate: {
                isIn: [
                    ['Student', 'Instructor']
                ]
            }
        },
        Admin: {
            //Indicate whether the user is Admin
            type: DataTypes.BOOLEAN,
            field: 'Admin'
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
        tableName: 'User',


    });
};
