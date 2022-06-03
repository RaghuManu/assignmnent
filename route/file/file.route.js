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

/* 
*
*
1. Insert a new folder or file at any level (root or inside a folder)
*
*/
fileRouter.post("/", upload.single("file"), addFile)

/* 
*
*
2. Get a list of all files reverse sorted by date
*
*/

fileRouter.get("/", getFileDetails)

/* 
*
*
3. Find the total size of a folder (like total size of files contained in Folder2)
*
*/

fileRouter.get("/size", getFolderSize)

/* 
*
*
4. Soft Delete a folder
*
*/

fileRouter.put("/disable", disableFolder)

/* 
*
*
5. Rename SubFolder2 to NestedFolder2
*
*/

fileRouter.put("/rename", renameFolder)

/* 
*
*
6. Write the response of below mentioned api in a json file and store file details in
database
○ GET - https://api.github.com/users/mralexgray/repos

*
*/

fileRouter.get("/add/jsonfile", addJsonFile)

/* 
*
*
7. Bonus points -
○ Move one file/folder from one location to another.
*
*/

fileRouter.put("/move/file", moveFile)

/* 
*
*
8. Bonus points -
Approach to search a file by filename, by file format, response should
include file path, file size, name, format. (It would be good, If you can
implement the logic)
*
*/

fileRouter.get("/search", searchFile)


module.exports = fileRouter