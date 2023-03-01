const {Schema,model} = require('mongoose')
const mongoose =require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt=require('bcrypt')

const user = new Schema({
    fname:{
        type:String
    },

    lname:{
        type:String
    },
   
    email:{
        type:String,
       
    },
   

    password:{
        type:String,
        default:" "
       
    },

    otp:{
        type:String
    }, 

    otpTime:{
        type:String
    },

    DateOfBirth:{
        type:String
    },
    
    Address:{
        type:String
    },
    
    otpverify:{
        type:Boolean,
        default:false
    },

    country_code:{
        type:String
    },

     mobileNumber:{
        type:Number,
       
    },
    status:{
        type:String,
        default:"ACTIVE"
    },
    userType:{
        type:String,
        enum : ['user','Admin','vendor'],
        default:"user"
    },
    approvedByAdmin:{
        type:String,
        enum : ['APPROVED','PENDING','REJECT'],
        default: 'PENDING'
        
    },
    

   
},
{timestamps:true}
);

 user.plugin(mongoosePaginate);
module.exports = model('user',user)




//ADMIN MODEL*************

mongoose.model("user", user).find({userType : "Admin"}, async (err, result)=>{
    if (err) {
        console.log("Default Admin Error", err);
    } else if (result.length != 0) {
        console.log("Default Admin",);
    }else{
        const otp = await Math.floor(100000 + Math.random()*90000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash("muni123", salt);
        const admin = {
            fname : "Lokendra",
            lname : "Muni",
            email : "lokendra@mailinator.com",
            mobileNumber : "9536765229",
            country_code : "+91",
            password : hashPassword,
            otp:otp,
            Address : "Delhi",
            DateOfBirth : "30-03-2001",
            userType:"Admin",
            otpverify:true
        };
        mongoose.model("user", user).create(admin, (err1, result1)=>{
            if (err1) {
                console.log("Admin creation error", err1);
            } else {
                // console.log("Default Admin created", result1);
                console.log("Default Admin created",result1);
            }
        });
    }
});
