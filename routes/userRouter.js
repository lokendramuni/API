const userRouter = require('express').Router();
const user = require('../controllers/user');

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
  
  userRouter.post("/multer",upload.array("user_file"), (req, res) => {
   res.status(200).send("file uploaded")
    });  



//USER.....
userRouter.post('/signup',user.signup)
userRouter.post('/otpverification',user.otpverification)
userRouter.post('/resetpassword',user.resetpassword)
userRouter.post('/forgetpassword',user.forgetpassword)
userRouter.get('/resendotp',user.resendotp)
userRouter.get('/userlist',user.userlist)
userRouter.get('/login',user.login)
userRouter.get('/paginate',user.paginate)
userRouter.get('/qrcode',user.qrcode)

//VENDOR......
userRouter.post('/vendorsignup',user.vendorsignup)
userRouter.get('/vendorlogin',user.vendorlogin)
userRouter.get('/userlistApi',user.userlistApi)


// admin........
userRouter.get('/Adminlogin',user.Adminlogin)
userRouter.get('/Pendinglist',user.Pendinglist)
userRouter.post('/AdminApproved',user.AdminApproved)
// userRouter.put('/AdminEditProfile',user.AdminEditProfile)



// userRouter.get('/token', auth.verifyToken)
userRouter.put('/editprofile',auth.verifyToken,user.editProfile)
userRouter.put('/changepassword',auth.verifyToken,user.changepassword)



//cloudinary
 const fileUpload = require('express-fileupload');
 userRouter.use(fileUpload({useTempFiles:true}));
 userRouter.post('/fileupload',user.fileupload)

module.exports = userRouter;