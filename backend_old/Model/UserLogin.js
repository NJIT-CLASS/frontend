module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserLogin', {
        UserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
            primaryKey: true
        },
        Email: {
            type: DataTypes.STRING(70),
            field: 'Email',
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            field: 'Password',
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
        tableName: 'UserLogin'
    });
};
