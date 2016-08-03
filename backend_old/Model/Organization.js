module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Organization', {
        OrganizationID: {
            //Unique identifier for the organization
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OrganizationID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        Name: {
            //Name of the organization
            type: DataTypes.STRING(40),
            field: 'Name',
            allowNull: true,
        }
        // Address: {
        //     //Address of the organization.
        //     type: DataTypes.STRING(70),
        //     field: 'Address',
        //     allowNull: false
        // },
        // City: {
        //     type: DataTypes.STRING(20),
        //     field: 'City',
        //     allowNull: false
        // },
        // State: {
        //     type: DataTypes.STRING(2),
        //     field: 'State',
        //     allowNull: false
        // },
        // ZipCode: {
        //     type: DataTypes.STRING(20),
        //     field: 'Zip',
        //     allowNull: false
        // },
        // Country: {
        //     type: DataTypes.STRING(30),
        //     field: 'Country',
        //     allowNull: false
        // },
        // Type: {
        //     //Unique identifier for the organization type.
        //     type: DataTypes.STRING,
        //     field: 'Type',
        //     allowNull: true
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
        tableName: 'Organization'
    });
};
