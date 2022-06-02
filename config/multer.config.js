const multer = require("multer")
const path = require("path")
const fs = require('fs');
let dir = 'root';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       
        dir =req.headers.filepath ? dir+"/"+req.headers.filepath: dir
      
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
     
      cb(null, dir)
      dir = 'root'
    },
    filename: function (req, file, cb) {
       
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload