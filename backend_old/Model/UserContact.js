module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserContact', {
        UserContactID: {
            //Unique contact identifier
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserContactID',
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Email: {//Email and Phone move to user table
            //Primary email
            type: DataTypes.STRING(70),
            field: 'Email',
            allowNull: false
        },
        Phone: {
            //Primary Phone Number
            type: DataTypes.STRING(15),
            field: 'Phone',
            allowNull: false
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
        tableName: 'UserContact'
    });
};
