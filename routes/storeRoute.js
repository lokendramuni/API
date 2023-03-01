const storeRouter = require("express").Router();
const store = require('../controllers/store');
const auth =require("../middleware/auth");
const multer = require('multer');
const path =require("path");

//multer......!!
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public"))
    },
    filename: function (req, file, cb) {
      cb(null, file.filename + '-' + Date.now()+ file.originalname)
    }
  });
  const upload = multer({ storage: storage })
  
   



storeRouter.post('/createStore',upload.array("Image"),store.createStore)
storeRouter.post('/storepopulate',store.storepopulate)



module.exports = storeRouter;