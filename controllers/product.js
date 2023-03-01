const productModel = require('../model/product');
const storeModel = require("../model/storeModel");
const CategoryModel = require("../model/cateModel");
const store = require('./store');

module.exports = {
    
    //product create
    productcreate: async (req, res) => {
        try {
            CategoryModel.findOne({ _id: req.body.category_id }, (err, result) => {
                if (result) {
                    if (result.approvedByAdmin == "PENDING" ) {
                        return res.status(402).send({ responseMessage: "Admin Approval Pending", responseCode: 402, result: {} });
                    } else {
                        productModel.create({ category_id: req.body.category_id, name: req.body.name },


                            productModel(req.body).save(async (err1, res1) => {
                                if (err1) {
                                    console.log(err1);
                                    return await res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, error: err1 });
                                } else {
                                    return await res.status(200).send({ responseMessage: "Data save Successfully...!!", responseCode: 200, res1 });
                                }
                            })
                        );
                    }
                } else {
                     return res.status(404).send({ responseMessage: "vendor is not in database..!!", responseCode: 404, result });
                }
            }
            )
        } catch (error) {
            return await res.status(501).send({ responseMessage: "Not Implemented", responseCode: 501, error: error });
        }
    },

    //get populate
    getpopulate: (req, res) => {
        productModel.find({ _id: req.body.product_id }, (err, user) => {
            if (err) {
                return res.status(404).send({ responseMessage: "User not found", responseCode: 404,err });
            } else {
                return res.status(200).send({ responseMessage: "Signup success", responseCode: 200, user });
            }
        }).populate('category_id')
    },
};