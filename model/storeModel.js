const { Schema, model } = require("mongoose");


const storeSchema = new Schema({
    
      vendor_id: {
        type: Schema.Types.ObjectId,
        ref:'user'
      },
    business_email:{
        type:String,
        
        
      },
      password:{
        type:String,
       default:" ",
        
      },  
    address:{
        type:String,
        required:true
        
      },  
      Image:{
        type:String,
      }, 

      
    pin: {
        type: String,        
        required:true
      },
      location: {
       type: {type: String,required:true},
       coordinates:[]        
        
      },

      approvedByAdmin:{
        type:String,
        enum : ['APPROVED','PENDING','REJECT'],
        default: 'PENDING'
        
    },

},
{timestamps:true}
);
storeSchema.index({location:"2dsphere"});

module.exports = model("store", storeSchema);