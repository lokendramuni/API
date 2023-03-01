const {Schema,model} = require('mongoose');


const product = new Schema({
  category_id: {
        type: Schema.Types.ObjectId,
        ref:'Category'
        
      },
      name: {
        type: String,
      },
      price: {
        type: String,
      },

},
{timestamps:true}
)
module.exports = model("product", product);