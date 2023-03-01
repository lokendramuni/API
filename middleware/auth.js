
const jwt = require("jsonwebtoken");
jwtKey = "jwt";
const userModel = require("../model/user"); 


    
    module.exports = {
      verifyToken: (req, res, next) => {
        try {
          jwt.verify(req.headers.token, "jwtKey", (err, result) => {
            if (err) {
              console.log(err);
              res.send({responseCode: 501,responseMessage: " Something went wrong!!",responseResult: err});         
              }
               else {
                userModel.findOne({ _id: result._id }, (err1, result5) => {
                  if (!result5) {
                    res.send({ responseCode: 404,responseMessage: "User not found..!!",responseResult: result5});
                  }
                     else {
                        req.userId = result5._id;
                        next();
                     }
                });
              }       
          });
        } catch (error) {
          res.send({responseCode: 500,responseMessage: "Internal Server Error",responseResult: error});  
        }
      },
    };



//   verifyToken : (req, res, next) => {
//     const token = req.headers.authorization;
//     if (!token) {
//         res.status(403).send({ responsMessage: "Token is Required..!!", responseCode: 403 });
//     }
//     try {
//         const decode = jwt.verify(token, jwtKey);
        
       
        
//     // res.json({
//     //     login:true,
//     //     data : decode
//     // })
       

//          res.status(200).json(decode).send("Token: verifyed..!!")
//     } catch (error) {
//         res.status(400).send("Invalid Token...!!")
//     }
//     return next();
// }




