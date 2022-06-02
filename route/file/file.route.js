const express = require("express");
const upload = require('../../config/multer.config.js');
const fileRouter = express.Router();
const {addFile,getFileDetails,getFolderSize,disableFolder} = require("./file.controller")

fileRouter.post("/",upload.single("file"),addFile)
fileRouter.get("/",getFileDetails)
fileRouter.get("/size",getFolderSize)
fileRouter.put("/disable",disableFolder)


module.exports = fileRouter