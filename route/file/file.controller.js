const db = require('../../config/db');
const Sequelize = db.sequelize;
const file_detail_model = db.file_detail_model

const addFile = (req, res) => {

    file_detail_model.create({
        folder_name: req.file.destination,
        original_file_name: req.file.originalname,
        file_format: req.file.mimetype,
        file_size: req.file.size,
        server_file_name: req.file.filename,


    }).then(() => {
        res.status(200).send({
            status: "success",
            message: "File created"
        })
    }).catch((error) => {
        res.status(500).send({
            status: "failure",
            message: error
        })
    })

}

const getFileDetails = (req, res) => {
    file_detail_model.findAll({
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['updatedAt', 'DESC']
        ]
    })
        .then((data) => {

            res.status(200).send({
                status: "success",
                message: "File details successfully retrieved",
                payload: data
            })

        })
        .catch((error) => {
            res.status(500).send({
                status: "failure",
                message: error
            })
        })
}

const getFolderSize = async (req, res) => {
    const folder_name = req.query.path;


    file_detail_model.sum("file_size", {
        where:
        {
            folder_name: {
                [db.Op.like]: (folder_name ? (folder_name.split('/').length > 1 ? `root/${folder_name}%` : `root/${folder_name}/%`) : `root%`)
            }
        }
    })


        .then((data) => {
            console.log(data)
            return res.status(200).send({
                payload: {
                    size: data,
                    folder_name: folder_name ? folder_name : "root"
                }
            })
        })
        .catch((error) => {
            res.status(500).send({
                status: "failure",
                message: error
            })
        })
}

const disableFolder = (req,res)=>{
    const file_id = req.query.id
    file_detail_model.update({ enable: "N" }, {
        where: {
            file_id: file_id
        }
    }).then((data)=>{
       
        if(data[0]) {

            res.status(200).send({
                status:"success",
                message:"soft delete of file is succeed"
            })
        } else {
            res.status(400).send({
                status:"Bad Request",
                message:"soft delete of file is failed. please send correct file id"
            })
        }

    });
}

module.exports = {
    addFile,
    getFileDetails,
    getFolderSize,
    disableFolder
}