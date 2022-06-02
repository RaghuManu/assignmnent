

module.exports = (sequelize, type) => {


    const File = sequelize.define('file_details', {


        file_id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            required: true
        },
        folder_name: {
            type: type.STRING(500),
            allowNull: false,
            required: true
        },

        original_file_name: {
            type: type.STRING,
            allowNull: false,
            required: true
        },

        server_file_name: {
            type: type.STRING,
            allowNull: false,
            required: true
        },

        file_format: {
            type: type.STRING,
            allowNull: false,
            required: true
        },

        file_size: {
            type: type.STRING,
            allowNull: false,
            required: true
        },
        enable: {
            type: type.STRING,
            allowNull: false,
            required: true,
            defaultValue: "Y"
        }

    }, {

        timestamps: true
    });

    return File;



}

