const { Schema, model } = require("mongoose");


const userData = new Schema({
    type: {
        type: String,
        
      },
    Description:{
        type:String,
        
      },
    title:{
        type:String,
        
      },  
    status: {
        type: String,        
        default:"Active"
      },

},
{timestamps:true}
)
module.exports = model("static", userData);