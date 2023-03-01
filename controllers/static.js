const staticModel = require("../model/staticcontent");
module.exports = {
    staticcreate: async (req, res) => {
        try {
            staticModel.findOne({ type: req.body.type }, async (err, result) => {
                if (err) {
                    return res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, err });
                } else if (result) {
        
                    return res.status(403).send({ responseMessage: "type already exist..!", responseCode: 403, err });
                }
                staticModel(req.body).save(async (err1, res1) => {
                    if (err1) {
                        console.log(err1);

                        return await res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, error: err1 });
                    } else {
                        return await res.status(200).send({ responseMessage: "Data Access Successfully...!!", responseCode: 200, res1 });
                    }
                });
            });
        } catch (error) {
            return await res.status(501).send({ responseMessage: "Not Implemented", responseCode: 501, error: error });
        }
    },

    //edit static
    editstatic: (req, res) => {
        try {
            staticModel.findByIdAndUpdate(
                { _id: req.params.id },
                { $set: req.body }, { new: true }, (err, res1) => {
                    if (err) {
                        res.status(404).send({ responseMessage: "user not found", responseCode: 404, err })
                    } else {
                        res.status(200).send({ responseMessage: "success", responseCode: 200, res1 })
                    }
                })
        } catch (error) {
            console.log("Something Went Woring..!");
            res.status(501).send({ responseCode: "Something went Worng..!!" });
        }
    },
};
