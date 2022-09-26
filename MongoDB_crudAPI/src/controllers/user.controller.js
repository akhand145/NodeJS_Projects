const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const twilio = require('twilio');

const accountSid = "AC444dea7560822c75d3e06bb3226d78cc";
const authToken = "a04d2375997030a66e9d47e63a68e66b";
const client = require("twilio")(accountSid, authToken);


// Create and Save a new User
// exports.create = async (req, res) => {

//     try {
//         // validate request
//         if (!req.body) {
//             await res.status(400).json({ message: "Please fill all required fields" })
//         }
//         // create a new user
//         const user = await userModel.insertMany(req.body)

//         return res.status(200).json({ user, message: "User Created Successfully" });

//     } catch (err) {
//         return res.status(500).json({
//             message: err.message ||
//                 "Something went wrong while creating new user"
//         })
//     }
// }


// Create and Save a new User
exports.create = async (req, res) => {
    try {
        console.log(req.body);
        const data = await userModel.findOne({ email: req.body.email });
        if (data) {
            res.send("Email is already exist please enter another email");
        } else {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);

            const jwtToken = await jwt.sign(
                { email: req.body.email },
                process.env.SECRET_KEY,
                { expiresIn: "1h" });

            req.body.token = jwtToken;

            // create a new user
            const user = await userModel.insertMany(req.body)

            return res.status(200).json({
                message: "User Created Successfully",
                user, jwtToken
            });
        }

    } catch (err) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while creating new user"
        })
    }
}


// Login an existing user
exports.login = async (req, res) => {
    try {
        const data = await userModel.findOne({ email: req.body.email });
        if (data) {
            const user = await bcrypt.compare(req.body.password, data.password);
            if (user) {
                const jwtToken = await jwt.sign(
                    { email: req.body.email },
                    process.env.SECRET_KEY,
                    { expiresIn: "1h" });

                req.body.token = jwtToken;

                // login a user
                await userModel.updateOne(
                    { email: data.email }, { $set: { token: jwtToken } });

                return await res.status(200).json({
                    message: "Login successfully", jwtToken
                });

            } else res.status(401).send("Wrong Password!!!");
        } else {
            return res.json('Enter correct email or password');
        }

    } catch (err) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while login a existing user"
        })
    }
}


// Logout an existing user
exports.logout = async (req, res) => {
    try {
        const data = await userModel.findOne({ email: req.body.email });

        if (!data) return res.status(404).send("Token is not valid");
        await userModel.updateOne(
            { _id: data._id }, { $set: { token: null } });

        return await res.status(200).json("User Logout Successfully");

    } catch (error) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while logout a existing user"
        })
    }
}


// Retrieve and return all users from the database.
exports.findAll = async (req, res) => {
    try {
        const users = await userModel.find()
        return res.status(200).json({ users, message: "All users get successfully" })

    } catch (err) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while finding users"
        })
    }
}


// Find a single User with a id
exports.findOne = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) {
            await res.status(404).json({
                message: "User not found with id" + req.params.id
            });
        }
        return await res.status(200).json({ user, message: "User get successfully" })

    } catch (err) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while finding a user"
        })
    }
}


// Update a User identified by the id in the request
exports.update = async (req, res) => {
    try {
        // Find user and update it with the request body
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!user) {
            return await res.status(404).json({
                message: "User not found with id" + req.params.id
            });
        }
        await userModel.updateOne({ _id: user._id }, { $set: { user: req.body.user } })
        return await res.status(200).json({ user, message: "User Updated Successfully" });

    } catch (err) {
        return res.status(500).json({
            message: "Error updating user with id " + req.params.id
        });
    }
}


// Soft delete a User with the specified id
exports.delete = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body);

        if (!user) {
            return await res.status(404).json({
                message: "User not found with id" + req.params.id
            });
        }
        await userModel.updateOne({ _id: user._id }, { $set: { isDeleted: true } })
        return await res.status(200).json({ message: "User Deleted Successfully" });

    } catch (err) {
        return res.status(500).json({
            message: "Could not delete user with id " + req.params.id
        });
    }
}


// Hard delete a User with the specified id
// exports.delete = async (req, res) => {
//     try {
//         const user = await userModel.findByIdAndDelete(req.params.id);

//         if (!user) {
//             return await res.status(404).json({
//                 message: "User not found with id" + req.params.id
//             });
//         }
//         return await res.status(200).json({ message: "User Deleted Successfully" });

//     } catch (err) {
//         return res.status(500).json({
//             message: "Could not delete user with id " + req.params.id
//         });
//     }
// }


// Verify a User by Admin with the specified id
exports.verify = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!user) {
            return await res.status(404).json({
                message: "User not found with id" + req.params.id
            });
        }
        await userModel.updateOne({ _id: user._id }, { $set: { isVerified: true } })
        return await res.status(200).json({ message: "User Verified Successfully by Admin" });

    } catch (err) {
        return res.status(500).json({
            message: "Could not verify user with id " + req.params.id
        });
    }
}


// sendOTP by nodeMailer and twilio
exports.sendOTP = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        const generateOTP = () => {
            let numbers = "0123456789";
            let OTP = "";
            for (let i = 0; i < 4; i++) {
                OTP += numbers[Math.floor(Math.random() * 10)];
            }
            return OTP;
        };
        const OTP = await generateOTP();
        const transporter = await mailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // await client.messages
        //     .create({
        //         body: `Hi your otp ${OTP}`,
        //         from: "+19207108873",
        //         to: "+916280664573",
        //     })
        //     .then(message => console.log(message))
        //     .catch(err => console.log(err));

        const mailDetails = {
            from: process.env.MAIL_ID,
            to: req.body.email,
            subject: "OTP Verification",
            text: `Your OTP is : ${OTP}`,
        };

        await transporter.sendMail(mailDetails, (err, info) => {
            if (err) console.log(err);
            else console.log("Email sent: " + info.response);
        });

        await userModel.updateOne({ _id: user._id }, { $set: { OTP: OTP } });

        return await res.status(200).send("Please check your Email and Verify your Account...");

    } catch (err) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while sending the OTP", err
        })
    }
}


// verifyOTP 
exports.verifyOTP = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (req.body.OTP === user.OTP) {
            await userModel.updateOne({ _id: user._id }, { $set: { verifyOTP: true } });

            return await res.status(200).json("Account is Successfully Verified");
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while verifying the OTP", err
        })
    }
}


// User's Forgot Password
exports.forgotPass = async (req, res) => {
    try {
        if (req.body.new_password === req.body.confirm_password) {

            const salt = await bcrypt.genSalt(10);
            req.body.new_password = await bcrypt.hash(req.body.new_password, salt);

            const user = await userModel.findById(req.params.id);
            const data = req.body.OTP === user.OTP;

            if (data) {
                await userModel.updateOne({ _id: user._id },
                    { $set: { password: req.body.new_password } })

                return await res.status(200).json({
                    data, message: "Password Updated Successfully"
                });
            }
            res.status(404).json("User not found");
        }
        res.status(401).json("Password not matched");

    } catch (error) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while using forgot the Password", err
        })
    }
}


// User's Reset Password
exports.resetPass = async (req, res) => {
    try {
        if (req.body.new_password === req.body.confirm_password) {

            const salt = await bcrypt.genSalt(10);
            req.body.new_password = await bcrypt.hash(req.body.new_password, salt);

            const user = await userModel.findById(req.params.id);
            const data = await bcrypt.compare(req.body.password, user.password);

            if (data) {
                await userModel.updateOne({ _id: user._id },
                    { $set: { password: req.body.new_password } })

                return await res.status(200).json({
                    data, message: "Password Updated Successfully"
                });
            }
            res.status(404).json("User not found");
        }
        res.status(401).json("Password not matched");

    } catch (err) {
        return res.status(500).json({
            message: err.message ||
                "Something went wrong while using reset the Password", err
        })
    }
}
