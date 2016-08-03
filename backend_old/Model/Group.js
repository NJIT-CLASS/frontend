module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Groups', {
        GroupID: {
            //Unique identifier for the group.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'GroupID',
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        SectionID: {
            //Unique identifier for the section
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false
        },
        Name: {
            //Name of the group
            type: DataTypes.STRING(30),
            field: 'Name',
            allowNull: true
        },
        Leader: {
            //Stores the ID of the user in the group with the authority to make decisions on behalf of the group. It is optional.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Leader',
            allowNull: true
        },
        List: {
            //Array of users
            type: DataTypes.BLOB,
            field: 'List',
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
        tableName: 'Groups'
    });
};
