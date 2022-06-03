const db = require('../../config/db');
const fs = require("fs")
const { move } = require("fs-extra")
const api = require("./../../config/api")
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
                [db.Op.or]: [{
                    [db.Op.like]: (folder_name ?
                        (folder_name.split('/').length > 1 ?
                            `root/${folder_name}%` : `root/${folder_name}/%`)
                        : `root%`)
                },

                {
                    [db.Op.like]: `root/${folder_name}%`

                }]
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

const disableFolder = (req, res) => {
    const file_id = req.query.id
    file_detail_model.update({ enable: "N" }, {
        where: {
            file_id: file_id
        }
    }).then((data) => {

        if (data[0]) {

            res.status(200).send({
                status: "success",
                message: "soft delete of file is succeed"
            })
        } else {
            res.status(400).send({
                status: "Bad Request",
                message: "soft delete of file is failed. please send correct file id"
            })
        }

    })
        .catch((error) => {
            res.status(500).send({
                status: "failure",
                message: error
            })
        })
}


const renameFolder = (req, res) => {
    const folder_name = req.query.path;
    const folderList = folder_name.split('/');
    const newFolderList = req.query.newpath.split('/');
    const newName = newFolderList.length ? newFolderList[newFolderList.length - 1] : ""
    const renamedFolder = folderList.length ? folderList[folderList.length - 1] : ""
    file_detail_model.findAll({
        where:
        {
            folder_name: {
                [db.Op.or]: [{
                    [db.Op.like]: (folder_name ?
                        (folder_name.split('/').length > 1 ?
                            `root/${folder_name}%` : `root/${folder_name}/%`)
                        : `root%`)
                },

                {
                    [db.Op.like]: `root/${folder_name}%`

                }]
            }
        }, raw: true
    }).then(async (data) => {

        if (renamedFolder) {
            for (const file of data) {
                const folderNameList = file.folder_name.split("/")
                console.log(folderNameList)
                const index = folderNameList.findIndex((ele) => {
                    return ele === renamedFolder;
                })

                if (index > -1) {
                    folderNameList.splice(index, 1, newName);
                    const db_new_folder_name = folderNameList.join("/")
                    const db_updated_flag = await file_detail_model.update({ folder_name: db_new_folder_name }, {
                        where: {
                            file_id: file.file_id
                        }
                    })


                    if (db_updated_flag[0]) {
                        console.log(`${folder_name}`, `${db_new_folder_name}`)
                        fs.rename(`root/${folder_name}`, `${db_new_folder_name}`, function (err) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Successfully renamed the directory.")
                            }
                        })
                    }



                }
            }
            res.status(200).send({
                status: "success",
                message: "rename folder succeed"
            })
        }

    })
        .catch((error) => {
            res.status(500).send({
                status: "failure",
                message: error
            })
        });
}

const addJsonFile = (req, res) => {

    api.get("https://api.github.com/users/mralexgray/repos")
        .then((data) => {
            const filename = `${new Date().getTime()}-api.json`
            fs.writeFile(`root/${filename}`, JSON.stringify(data), (err) => {

                if (err) {
                    console.log(err)
                } else {
                    fs.stat(`root/${filename}`, (err, stats) => {
                        if (err) {
                            console.log(`File doesn't exist.`);
                        } else {

                            file_detail_model.create({
                                folder_name: "root",
                                original_file_name: filename,
                                file_format: "application/json",
                                file_size: stats.size,
                                server_file_name: filename,


                            })
                        }
                    });
                }

            })
            return res.send(data)
        })
        .catch((error) => {
            res.status(500).send({
                status: "failure",
                message: error
            })
        })
}

const moveFile = async (req, res) => {

    try {


        const fileId = req.query.id;
        const file = await file_detail_model.findOne({ where: { file_id: fileId }, raw: true });
        const srcPath = `${file['folder_name']}/${file['server_file_name']}`
        const destPath = `root/${req.query.dest}/${file['server_file_name']}`;
        move(srcPath, destPath, (err) => {
            if (err) return console.log(err);
            console.log(`File successfully moved!!`);
            file_detail_model.update({ folder_name: `root/${req.query.dest}` }, {
                where: {
                    file_id: fileId
                }
            })

            res.status(200).send({
                status: "success",
                message: "File successfully moved!!"
            })
        });
    } catch (error) {
        res.status(500).send({
            status: "failure",
            message: error
        })
    }

}

const searchFile = async (req, res) => {
    try {
        const searchValue = req.query.search;
        const data = await file_detail_model.findAll({
            where: {
                [db.Op.or]: [
                    { original_file_name: searchValue },
                    { file_format: searchValue }
                ]
            }, raw: true
        });

        res.status(200).send({
            status: "success",
            payload: data
        })

    } catch (error) {
        res.status(500).send({
            status: "failure",
            message: error
        })
    }
}



module.exports = {
    addFile,
    getFileDetails,
    getFolderSize,
    disableFolder,
    renameFolder,
    addJsonFile,
    moveFile,
    searchFile
}