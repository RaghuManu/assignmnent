const express = require("express");
const upload = require('../../config/multer.config.js');
const fileRouter = express.Router();
const { addFile,
    getFileDetails,
    getFolderSize,
    disableFolder,
    renameFolder,
    addJsonFile,
    moveFile,
    searchFile } = require("./file.controller")

fileRouter.post("/", upload.single("file"), addFile)
fileRouter.get("/", getFileDetails)
fileRouter.get("/size", getFolderSize)
fileRouter.put("/disable", disableFolder)
fileRouter.put("/rename", renameFolder)
fileRouter.get("/add/jsonfile", addJsonFile)
fileRouter.put("/move/file", moveFile)
fileRouter.get("/search", searchFile)


module.exports = fileRouter