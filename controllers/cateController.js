const CategoryModel = require("../model/cateModel");


module.exports={


createCategory: async (req, res) => {
  try {
    CategoryModel.findOne({ name: req.body.name }, async (err, result) => {
          if (err) {
              return res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, err });
          } else if (result) {
  
              return res.status(403).send({ responseMessage: "category already exist", responseCode: 403, err });
          }
          CategoryModel(req.body).save(async (err1, res1) => {
              if (err1) {
                  console.log(err1);

                  return await res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, error: err1 });
              } else {
                  return await res.status(200).send({ responseMessage: "category save Successfully", responseCode: 200, res1 });
              }
          });
      });
  } catch (error) {
      return await res.status(501).send({ responseMessage: "Not Implemented", responseCode: 501, error: error });
  }
},

categoryPopulate: (req, res) => {
  CategoryModel.find({ _id: req.body.category_id }, (err, user) => {
      if (err) {
          return res.status(404).send({ responseMessage: "User not found", responseCode: 404,err });
      } else {
          return res.status(200).send({ responseMessage: "Signup success", responseCode: 200, user });
      }
  }).populate('store_id')
},

  
}