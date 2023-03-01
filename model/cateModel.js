const {Schema,model} = require('mongoose');

const cateSchema = new Schema(
  {

    store_id: {
      type: Schema.Types.ObjectId,
      ref:'store'
      
    },
    name: {
      type: String,
      required: true,
      
    }
  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = model("Category", cateSchema);