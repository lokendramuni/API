const userModel = require('../model/user');
const storeModel = require('../model/storeModel');
const otp = require("../helper/common");
const bcrypt = require("bcrypt");
const { hashSync } = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const { json } = require('express/lib/response');
const user = require('../model/user');
jwtKey = "jwt";
const mess = require("../helper/message");
const { success, conflict, Something_went_wrong, Not_found, accepted, requestTimeout, unauthorized, Internal_server_error } = require('../helper/message');
const cloudinary = require("cloudinary").v2;
const QRCode = require('qrcode');
const randomstring = require("randomstring")

cloudinary.config({
    cloud_name: 'do8b7rnfh',
    api_key: '141295993511762',
    api_secret: 'AJ8TefjQdGtOB4t069W16dOFWYM'
});


module.exports = {

    // Api development
    // signup,otpverify,forgotpassword,resetpassword,resendotp,login, fileupload, editprofile, listusers

    signup: (req, res) => {

        try {
            userModel.findOne({ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, (err, result) => {

                if (err) {
                    return res.status(500).send({/*responseMessage: "Internal server error", responseCode: 500,*/mess: Internal_server_error(), error: err })

                }
                else if (result) {

                    let errors = {};
                    if (result.mobileNumber == req.body.mobileNumber) {
                        errors.mobileNumber = "mobileNumber already exists";
                    } else {
                        errors.email = "Email already exists";
                    }
                    return res.status(400).json(errors)


                    //return res.status(409).send({ /*responseMessage: "email or mobileno. already exists", responseCode: 409,*/ mess: conflict(), error: err })
                }
                if (req.body.password != req.body.confirmpassword) {
                    return res.status(403).send({ responseMessage: " confirmpassword is incorrect", responseCode: 403 });
                }
                else {

                    /* Adding Curent Time for OTP Verification...*/
                    req.body.otpTime = Date.now() + 120000

                    //  hash password
                    var hashpass = hashSync(req.body.password, 10)
                    req.body.password = hashpass

                    // //OTP generate  
                    otpass = otp.generateOTP()
                    req.body.otp = otpass


                    userModel(req.body).save((err1, res1) => {
                        if (err1) {
                            return res.status(500).send({ /*responseMessage: "Internal server error", responseCode: 500 ,*/mess: Internal_server_error(), error: err1 })

                        }
                        else {

                            return res.status(200).send({ /*responseMessage: "Signup success", responseCode: 200,*/mess: success(), res1 })
                        }

                    })
                }
            })
        } catch (error) {
            return res.status(501).send({/*responseMessage: "Something went wrong",responseCode: 501,*/mess: Something_went_wrong, error: error })
        }
    },

    // otpverification Api......
    otpverification: (req, res) => {

        try {
            userModel.findOne({ email: req.body.email }, (err, res1) => {

                if (err) {
                    console.log("Email is not in Database..!!");
                    return res.status(404).send({/* responseMessage: "Email is not in database..!!", responseCode: 404*/ mess: Not_found() });
                }
                else {
                    try {
                        if (res1.otp == req.body.otp) {
                            /* Compair OTP at real time...!! */
                            if (res1.otpTime >= Date.now()) {

                                userModel.findByIdAndUpdate(
                                    { _id: res1.id },
                                    { otpverify: true },
                                    { new: true },
                                    (err, result3) => {
                                        if (err) {
                                            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: err })
                                        } else {
                                            return res.status(202).send({ /*responseMessage: "OTP Verifyed...!!", responseCode: 202*/mess: accepted(), result3 });
                                        }
                                    }
                                );

                            }
                            else {
                                console.log("OTP Time Out Please resend it...!!");
                                return res.status(400).send({ /*responseMessage: "OTP Time Out.. Resnr it..!!", responseCode: 400*/mess: requestTimeout() });
                            }
                        }
                        else {
                            console.log("OTP not valid..!!");
                            return res.status(400).send({ /*responseMessage: "OTP not Valid.!!", responseCode: 401*/ mess: unauthorized() })
                        }

                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        } catch (error) {
            console.log("Something Went Woring..!");
            console.log(error);
            return res.status(501).send({ /*responseCode:501, responseMessage: "Something went Worng..!!"*/mess: Something_went_wrong() });

        }
    },

    // forget password.....
    forgetpassword: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, result) => {
                if (err) {
                    return res.status(404).send({ responseMessage: "Email is not exists", responseCode: 404, error: err })

                }

                else if (result) {

                    /* Adding Curent Time for OTP Verification...*/
                    Notptime = Date.now() + 300000

                    // //OTP generate  
                    otppass = otp.generateOTP()
                    // req.body.otp = otppass,


                    let mailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'lokendra.chandravanshi@indicchain.com',
                            pass: 'bgxsgvbbmlacmvno'

                        }
                    });

                    let mailDetails = {
                        from: 'fortestingpurpose0077@gmail.com',
                        to: req.body.email,
                        subject: 'Otp mail',
                        text: 'Your otp is' + "  " + otppass,
                        // html: '<a href="http://localhost:7000/app/v1/user/login">click on link</a>',
                    };



                    mailTransporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            console.log('Error Occurs');
                        } else {
                            return res.status(200).send({ responseMessage: " OTP send successfully", responseCode: 200, res: res1 })
                        }
                    })
                    userModel.findByIdAndUpdate(
                        { _id: result.id },
                        { otpTime: Notptime, otp: otppass },
                        { new: true },
                        (err, result4) => {
                            if (err) {
                                return res.status(404).send({ responseMessage: "user not found", responseCode: 404, err: err });
                            } else {
                                return res.status(200).send({ responseMessage: "success", responseCode: 200, res: result4, });
                            }
                        }
                    );
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    // //  resetpassword api......
    resetpassword: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, result) => {
                if (!result) {
                    console.log("Email is not in the databse..!!");
                    return res.status(404).send({ responseMessage: "Email is not In the Database..!!", responseCode: 404 });
                }
                else if (result) {

                    let check = bcrypt.compareSync(req.body.password, result.password);
                    if (check == true) {
                        return res.status(402).send({ responseMessage: " Password is Same As Proivous Password", responseCode: 402, result: {} });
                    }
                    else {
                        var hashpass = hashSync(req.body.password, 10)
                        req.body.password = hashpass

                        userModel.findByIdAndUpdate(
                            { _id: result._id },
                            { password: req.body.password },
                            { new: true },
                            (err, result4) => {
                                if (err) {
                                    return res.status(404).send({ responseMessage: "user not found", responseCode: 404, err: err });
                                } else {
                                    return res.status(200).send({ responseMessage: "success", responseCode: 200, res: result4, });
                                }
                            }
                        );
                    }
                }
            });
        } catch (error) {
            res.status(501).send({ responseCode: "Something_went_wrong" });

        }
    },
    // changepasssword.....
    changepassword: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (err, result) => {
                if (!result) {

                    return res.status(404).send({ responseMessage: "user is not In the Database..!!", responseCode: 404 });
                }
                else if (result) {

                    let check = bcrypt.compareSync(req.body.oldpassword, result.password);
                    if (check == false) {
                        return res.status(402).send({ responseMessage: " oldPassword is not Same as Previous Password", responseCode: 402, result: {} });
                    }
                    if (req.body.password != req.body.confirmpassword) {
                        return res.status(403).send({ responseMessage: " password and confirm password doesn't matched  ", responseCode: 403 });
                    }


                    else {
                        var hashpass = hashSync(req.body.password, 10)
                        req.body.password = hashpass
                        userModel.findByIdAndUpdate(
                            { _id: result._id },
                            { password: req.body.password },
                            { new: true },
                            (err, result4) => {
                                if (err) {
                                    return res.status(404).send({ responseMessage: "user not found", responseCode: 404, err: err });
                                } else {
                                    return res.status(200).send({ responseMessage: "success", responseCode: 200, res: result4, });
                                }
                            }
                        );
                    }

                }
            });
        } catch (error) {
            return res.status(501).send({ responseCode: "Something_went_wrong" });

        }
    },

    //resendotp api......
    resendotp: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, result) => {
                if (err) {
                    return res.status(404).send({ responseMessage: "Email is not exists", responseCode: 404, error: err })

                }

                else if (result) {

                    /* Adding Curent Time for OTP Verification...*/
                    Notptime = Date.now() + 300000

                    // //OTP generate  
                    otppass = otp.generateOTP()
                    // req.body.otp = otppass,


                    let mailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'fortestingpurpose0077@gmail.com',
                            pass: 'bztzdeyoecetitik'

                        }
                    });

                    let mailDetails = {
                        from: 'fortestingpurpose0077@gmail.com',
                        to: req.body.email,
                        subject: 'Otp mail',
                        text: 'Your otp is' + "  " + otppass,
                        // html:'<a href="https://www.mobiloitte.com">click on link</a>',
                    };


                    mailTransporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            console.log('Error Occurs');
                        } else {
                            return res.status(200).send({ responseMessage: "OTP Resend successfully", responseCode: 200, res: res1 })
                        }
                    })
                    userModel.findByIdAndUpdate(
                        { _id: result.id },
                        { otpTime: Notptime, otp: otppass },
                        { new: true },
                        (err, result4) => {
                            if (err) {
                                return res
                                    .status(404)
                                    .send({ responseMessage: "user not found", responseCode: 404, err: err });
                            } else {
                                return res.status(200).send({
                                    responseMessage: "success",
                                    responseCode: 200,
                                    res: result4,
                                });
                            }
                        }
                    );
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    // Login api.....
    login: (req, res) => {
        try {
            let email = req.body.email;
            userModel.findOne({ email: email }, (err, result) => {
                // console.log("result============>", result);
                if (result) {
                    if (result.otpverify == true) {

                        let check = bcrypt.compareSync(req.body.password, result.password);
                        if (check == false) {
                            return res.status(402).send({ responseMessage: " Password is Incorrect", responseCode: 402, result: {} });
                        }
                        else {
                            const token = jwt.sign({ _id: result._id, email: result.email }, "jwtKey", { expiresIn: '1H' })
                            // const response = {
                            //     token: tokenData,
                            //     userDetails: result
                            // }
                            return res.status(200).send({ responseMessage: "login success", responseCode: 200, token, result })
                        }
                    } else {
                        return res.status(401).send({ responseMessage: "OTP is not verified", responseCode: 401 })

                    }
                } else {
                    return res.status(404).send({ responseMessage: "Email is not in database..!!", responseCode: 404, result });

                }
            });
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    //   fileupload cloudinary api.....
    fileupload: (req, res) => {

        const file = (req.files.photo);
        cloudinary.uploader.upload(file.tempFilePath, (err, result) => {

            if (err) {
                return res.status(404).send({ responseMessage: "Internal server error", responseCode: 404 })
            }
            else {
                return res.status(200).send({ responseMessage: "upload success", responseCode: 200, result }),
                    // console.log(result)
                    console.log(result.secure_url)
            }
        })
    },

    //Edit profile api.....
    editProfile: async (req, res) => {
        try {
            let user = await userModel.findOne({ _id: req.userId });
            if (!user) {
                res.send({ responseCode: 404, responseMessage: "User Not Found", responseResult: [] });
            } else {
                const updateUser = await userModel.findByIdAndUpdate(
                    { _id: user._id },
                    { $set: req.body },
                    { new: true }
                );
                res.send({ responseCode: 200, responseMessage: "Profile updated successfully..!!", responseResult: updateUser });
            }
        } catch (error) {
            res.send({ responseCode: 501, responseMessage: "Something Went Wrong", result: error });
        }
    },

    // userlist....
    userlist: (req, res) => {
        try {
            userModel.find({ status: "ACTIVE" }, (err, user) => {
                if (err) {
                    return res.status(404).send({ responseMessage: "User not found", responseCode: 404, });
                } else {

                    // console.log(user)
                    res.status(200).send({ responseMessage: "Signup success", responseCode: 200, user });
                }
            });
        }
        catch (error) {
            res.status(501).send({ responseCode: "Something went Wrong..!!" });

        }
    },

    // paginate api two method....
    paginate: async (req, res) => {
        // user.paginate({}, { page: req.body.page, limit: req.body.limit })
        //     // try {
        //     //      (err, res1) => {
        //     //         if (err) {
        //     //             return res.status(404).send({ responseMessage: "User not found", responseCode: 404, });
        //     //         } else {

        //     //             // console.log(user)
        //     //             res.status(200).send({ responseMessage: "Signup success", responseCode: 200, res1});
        //     //         }
        //     //     };
        //     // }
        //     .then(res1 => { res.json({ res1 }) })
        //     .catch(error => { res.json({ message: "an error Occured", error }) })
        try {
            var page = req.body.page;
            var sort = req.body.sort;
            var user_data;
            var skip;
            if (page <= 1) {
                skip = 0;
            } else {
                skip = (page - 1) * 2;
            }
            if (sort) {
                if (sort == "name") {
                    usersort = {
                        name: 1

                    }
                }
                else if (sort == '_id') {
                    usersort = {
                        _id: 1

                    }
                }
                user_data = await userModel.find().sort(usersort).skip(skip).limit(2);

            } else {
                user_data = await userModel.find().skip(skip).limit(2);
            }
            res.status(200).send({ success: true, msg: "User Details", data: user_data });
        } catch (error) {
            res.status(400).send(error.message);
        }

    },

    //QR code Generator.....
    qrcode: (req, res) => {
        // Creating the data
        let data = {
            fname: req.body.fname,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
        }

        // Converting the data into String format
        let stringdata = JSON.stringify(data)

        // Print the QR code to terminal
        QRCode.toString(stringdata, { type: 'terminal' },
            function (err, QRcode) {

                if (err) return console.log("error occurred")

                // Printing the generated code
                console.log(QRcode)
            })

        // Converting the data into base64
        QRCode.toDataURL(stringdata, function (err, code) {
            if (err) return console.log("error occurred")

            // Printing the code
            console.log(code)
        })

    },

    //admin login....
    Adminlogin: (req, res) => {
        try {
            let email = req.body.email;
            userModel.findOne({ email: email }, (err, result) => {
                // console.log("result============>", result);
                if (result) {
                    let check = bcrypt.compareSync(req.body.password, result.password);
                    if (check == false) {
                        return res.status(402).send({ responseMessage: " Password is Incorrect", responseCode: 402, result: {} });
                    }
                    else {
                        const token = jwt.sign({ result }, "jwtKey", { expiresIn: '1H' })

                        return res.status(200).send({ responseMessage: "login success", responseCode: 200, token, result })
                    }
                } else {
                    return res.status(404).send({ responseMessage: "Email is not in database..!!", responseCode: 404, result });
                }
            });
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    //pending list...
    Pendinglist: async (req, res) => {
        try {
            userModel.find({ approvedByAdmin: req.body.approvedByAdmin, userType: req.body.userType }, (err, user) => {
                if (err) {
                    return res.status(404).send({ responseMessage: "Data not found", responseCode: 404, });
                } else {

                    return res.status(200).send({ responseMessage: req.body.approvedByAdmin + " " + "list of vendors", responseCode: 200, user });
                }
            });
        }
        catch (error) {
            return res.status(501).send({ responseCode: "Something went Wrong..!!" });
        }
    },

    //AdminApproves
    AdminApproved: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, result) => {
                if (err) {
                    return res.status(404).send({ responseMessage: "Vendor  does not exist in database..!!", responseCode: 404 });
                } else {

                    let random = randomstring.generate(7);

                    let mailDetails = {
                        from: "lokendra.chandravanshi@indicchain.com",
                        to: req.body.email,
                        subject: "Credentials for vendor login",
                        text: "User ID  for vendor login is: " + " " + req.body.email + " " + "And password is:" + " " + random + "",

                    };
                    nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "lokendra.chandravanshi@indicchain.com",
                            pass: "bgxsgvbbmlacmvno",
                        },
                    })
                        .sendMail(mailDetails, (err) => {
                            if (err) {
                                return console.log("error", err);
                            } else {
                                return console.log("Mail sent successfully! ");
                            }
                        });

                    let newRamdom = hashSync(random, 10);
                    userModel.findByIdAndUpdate(
                        { _id: result._id },
                        { $set: { approvedByAdmin: "APPROVED", password: newRamdom } },
                        { new: true },
                        async (err, result1) => {
                            if (err) {
                                return await res.status(500).send({ responseMessage: "User not found", responseCode: 500, result1: {} });
                            } else {
                                return await res.status(200).send({ responseMessage: "success", responseCode: 200, res: result1 });
                            }
                        });
                }
            });
        }
        catch (error) {
            return res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, result: {} });
        }
    },



    // vendorsignup
    // vendorsignup: (req, res) => {
    //     try {
    //         userModel.findOne({ business_email: req.body.business_email }, (err, result) => {

    //             if (err) {
    //                 return res.status(500).send({/*responseMessage: "Internal server error", responseCode: 500,*/mess: Internal_server_error(), error: err })

    //             }
    //             else if (result) {
    //                 return res.status(409).send({ /*responseMessage: "business_email already exists", responseCode: 409,*/ mess: conflict(), error: err })
    //             }
    //             else {

    //                 let mailDetails = {
    //                     from: "lokendra.chandravanshi@indicchain.com",
    //                     to: req.body.business_email,
    //                     subject: "Credentials for vendor signUp",
    //                     text: "Thanks for become a  vendor ",

    //                 };
    //                 nodemailer.createTransport({
    //                     service: "gmail",
    //                     auth: {
    //                         user: "lokendra.chandravanshi@indicchain.com",
    //                         pass: "bgxsgvbbmlacmvno",
    //                     },
    //                 })
    //                     .sendMail(mailDetails, (err) => {
    //                         if (err) {
    //                             return console.log("error", err);
    //                         } else {
    //                             return console.log("Mail sent successfully! ");
    //                         }
    //                     });
    //                 userModel(req.body).save((err1, res1) => {
    //                     if (err1) {
    //                         return res.status(500).send({ /*responseMessage: "Internal server error", responseCode: 500 ,*/mess: Internal_server_error(), error: err1 })

    //                     }
    //                     else {

    //                         return res.status(200).send({ /*responseMessage: "Signup success", responseCode: 200,*/mess: success(), res1 })
    //                     }
    //                 })
    //             }
    //         })
    //     } catch (error) {
    //         return res.status(501).send({/*responseMessage: "Something went wrong",responseCode: 501,*/mess: Something_went_wrong, error: error })
    //     }
    // },


    vendorsignup: async (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, async (err, result) => {
                if (!result) {
                    let mailDetails = {
                        from: "shubham.kumar@mailinator.com",
                        to: req.body.email,
                        subject: "vendor signup successfully",
                        text: "Thanks for become a  vendor  "

                    };
                    nodemailer
                        .createTransport({
                            service: "gmail",
                            auth: {
                                user: "lokendra.chandravanshi@indicchain.com",
                                pass: "bgxsgvbbmlacmvno",
                            },
                        })
                        .sendMail(mailDetails, (err) => {
                            if (err) {
                                return console.log("error", err);
                            } else {
                                return console.log("Mail  sent! ");
                            }
                        });
                    userModel(req.body).save(async (err1, res1) => {

                        if (err1) {
                            console.log(err1);
                            return await res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, error: err1 });
                        } else {
                            return await res.status(200).send({ responseMessage: "Vendor Created Successfully", responseCode: 200, res: res1 });
                        }
                    });

                } else {
                    return res.status(200).send({ responseMessage: "This vendor is already exist..", responseCode: 200, err });
                }
            })
        } catch (error) {
            return await res.status(501).send({ responseMessage: "Not Implemented", responseCode: 501, error: error });
        }
    },

    vendorlogin: (req, res) => {
        try {
            let email = req.body.email;
            userModel.findOne({ email: email }, (err, result) => {

                if (result) {
                    let check = bcrypt.compareSync(req.body.password, result.password);
                    if (check == false) {
                        return res.status(402).send({ responseMessage: " Password is Incorrect", responseCode: 402, result: {} });
                    }
                    else {
                        const token = jwt.sign({ _id: result._id, email: result.email }, "jwtKey", { expiresIn: '1H' })

                        return res.status(200).send({ responseMessage: "login success", responseCode: 200, token, result })
                    }

                } else {
                    return res.status(404).send({ responseMessage: "Email is not in database..!!", responseCode: 404, result });

                }
            });
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    // userlistApi
    // userlistApi: async (req, res) => {
    //     try {
    //         userModel.find({ userType: req.body.userType }, (err, user) => {
    //             if (err) {
    //                 return res.status(404).send({ responseMessage: "Data not found", responseCode: 404, });
    //             } else {

    //                 return res.status(200).send({ responseMessage: req.body.userType + " " + "lists", responseCode: 200, user });
    //             }
    //         });
    //     }
    //     catch (error) {
    //         res.status(501).send({ responseCode: "Something went Wrong..!!" });

    //     }
    // },

    userlistApi: async (req, res) => {
        try {
            const { status, userType, page, limit, search } = req.body
            let query = { status: { $ne: "DELETE" } };
            if (userType) {
                query.userType = userType;
            }
            if (search) {
                query.$or = [
                    { fname: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    // { userType: { $regex: search, $options: "i" } },
                    { status: { $regex: search, $options: "i" } },
                ];
            }
            let options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sort: { createdAt: -1 }
            };
            var user_data = await userModel.paginate(query, options);
            if (user_data.docs) {
                return res.status(200).send({ status: "success", responseMessage: "user details", responseCode: 200, Data: user_data });
            } else {
                return res.status(404).send({ status: "success", responseMessage: "user not found", responseCode: 404, });
            }

        } catch (error) {
            console.log("error", error)
            res.status(501).send({ responseCode: "Something went Wrong..!!" });
        }
    }



}



