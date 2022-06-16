const path = require("path");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const FilePath = path.join(__dirname, "../images");
    cb(null, FilePath);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  
  },
});

var upload = multer({ storage: storage });
 module.exports=upload;