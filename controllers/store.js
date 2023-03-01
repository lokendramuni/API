const storeModel = require("../model/storeModel");
const userModel = require('../model/user');

module.exports = {

  // create Store--------
  createStore: async (req, res) => {
    try {
      userModel.findOne({ _id: req.body.vendor_id }, async (err, result) => {
        if (result) {
          if (!req.body.latitude || !req.body.longitude) {
            return res.status(402).send({ responseMessage: "latitude and longitude is required.", responseCode: 402, err });
          } else {
            const vendorData = await storeModel.findOne({ business_email: req.body.business_email });
            if (vendorData) {
              return res.status(200).send({ responseMessage: "This vendor is already created a store.", responseCode: 200, err });
            } else {
              const storedata = storeModel({
                vendor_id: req.body.vendor_id,
                business_email: req.body.business_email,
                address: req.body.address,
                Image: req.files.Image,
                pin: req.body.pin,
                location: {
                  type: "Point",
                  coordinates: [
                    parseFloat(req.body.latitude),
                    parseFloat(req.body.longitude),

                  ],
                },
              });
              storedata.save(async (err1, res1) => {
                if (err1) {
                  console.log(err1);
                  return await res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, error: err1 });
                } else {
                  return await res.status(200).send({ responseMessage: "Store Created Successfully", responseCode: 200, res: res1 });
                }
              });
            }
          }
        } else {
          return res.status(403).send({ responseMessage: "Vendor Id does not exist..!", responseCode: 403, err });
        }
      });
    } catch (error) {
      return await res.status(501).send({ responseMessage: "Not Implemented", responseCode: 501, error: error });
    }
  },

storepopulate: (req, res) => {
    storeModel.find({ _id: req.body.store_id }, (err, user) => {
        if (err) {
            return res.status(404).send({ responseMessage: "User not found", responseCode: 404,err });
        } else {
             //console.log(user)
            return res.status(200).send({ responseMessage: "Signup success", responseCode: 200, user });
        }
    }).populate('vendor_id')
},
}