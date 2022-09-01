const db = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const twilio = require('twilio');
const { Op } = require('sequelize');
const { users, auths } = require('../models/index');

const accountSid = "AC444dea7560822c75d3e06bb3226d78cc";
const authToken = "e89b50599adf2c90d8108b3151d01bee";
const client = require("twilio")(accountSid, authToken);


// create a new post:
exports.create = async (req, res) => {
    try {
        console.log(req.body);
        const data = await db.auths.findOne({ where: { email: req.body.email } });
        if (data) {
            res.send("Email is already exist please enter another email");
        } else {
            const auth = {
                email: req.body.email,
                password: req.body.password
            }
            const id = await db.users.create(req.body);
            console.log(id.dataValues.id);
            const token = await jwt.sign(
                { userID: id.dataValues.id, userType: 'User' },
                process.env.ACCESS_TOKEN,
                { expiresIn: "1h" }
            );
            const hashPass = await bcrypt.hash(auth.password, 10);

            auth.userID = id.dataValues.id;
            auth.password = hashPass;
            auth.token = token;
            await db.auths.create(auth);
            res.status(200).json({ success: "User Signup successfully", token });
        }
    } catch (err) {
        res.send(err);
    }
}


// login a user
exports.login = async (req, res) => {
    try {
        const data = await db.auths.findOne({ where: { email: req.body.email } });
        console.log(data.dataValues.id);
        if (data) {
            const result = await bcrypt.compare(req.body.password, data.dataValues.password);
            console.log(result);
            if (result) {
                const token = jwt.sign(
                    { userID: data.dataValues.id, userType: 'User' },
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "1h" });
                req.body.token = token;

                await db.auths.update(
                    { token: req.body.token },
                    { where: { email: data.dataValues.email } }
                );
                console.log(token);
                res.status(200).json({ success: "Login successfully", token });
            } else res.status(401).send("Wrong Password!!!");
        }
        else {
            return res.json('Enter correct email or password');
        }
    } catch (err) {
        res.send(err);
    }
};


// logout a user
exports.logout = async (req, res) => {
    try {
        const data = await db.auths.findOne({ where: { email: req.body.email } });
        if (!data) return res.status(404).send("Token is not Valid");
        await db.auths.update(
            { token: null },
            { where: { id: data.dataValues.userID } }
        );
        res.status(200).json("User Logout successfully...");
    } catch (err) {
        res.send(err);
    }
};


// getAll user
exports.getAll = async (req, res) => {
    try {
        const data = await db.users.findAll({
            include: [db.auths]
        });
        console.log(data);
        return res.status(200).json(data);
    } catch (error) {
        res.send(error);
    }
}

// getById user
exports.getById = async (req, res) => {
    try {
        const data = await db.users.findAll({
            where: { id: req.params.id },
            include: [db.auths],
        });
        console.log(data);
        return res.status(200).json(data);
    } catch (error) {
        res.send(error);
    }
}

// update a user
exports.updateUser = async (req, res) => {
    try {
        let user = await db.users.update(req.body, {
            where: { id: req.params.id }
        });
        await db.auths.update(req.body, {
            where: { id: req.params.id }
        })
        console.log(user);
        return res.status(200).json({ message: "Data updated successfully", user });
    } catch (error) {
        res.send(error);
    }
}

// delete a user
exports.deleteUser = async (req, res) => {
    try {
        let data = await db.users.update({ isDeleted: 'Yes', status: 'User Deleted' }, {
            where: { id: req.params.id }
        });
        console.log(data);
        return res.status(200).json({ message: "Data Deleted successfully", data });
    } catch (error) {
        res.send(error);
    }
    // await db.users.delete({ where: { id: req.params.id } })
    // return res.status(200).json({ message: "Data deleted successfully" });
}


// verify a user by admin
exports.verifyUser = async (req, res) => {
    try {
        let data = await db.users.update({ isVerify: 'Yes' }, {
            where: { id: req.params.id }
        });
        console.log(data);
        return res.status(200).json({ message: "User Verified Successfully", data });
    } catch (error) {
        res.send(error);
    }
}


// sendOTP by nodeMailer and twilio
exports.sendOTP = async (req, res) => {
    try {
        const data = await db.auths.findOne({ where: { email: req.body.email } });
        const generateOTP = () => {
            let numbers = "0123456789";
            let OTP = "";
            for (let i = 0; i < 4; i++) {
                OTP += numbers[Math.floor(Math.random() * 10)];
            }
            return OTP;
        };
        const OTP = generateOTP();
        const transporter = mailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // client.messages
        //     .create({
        //         body: `Hi your otp ${OTP}`,
        //         from: "+19207108873",
        //         to: "+916280664573",
        //     })
        //     .then(message => console.log(message))
        //     .catch(err => console.log(err));

        var mailOptions = {
            from: process.env.MAIL_ID,
            to: req.body.email,
            subject: "OTP Verification",
            text: `Your OTP is : ${OTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error);
            else console.log("Email sent: " + info.response);
        });

        // await db.otps.create({ email: data.dataValues.email, OTP: OTP, expiryTime: data.dataValues.expiryTime, userID: data.dataValues.id }, { where: { email: req.body.email } });
        await db.otps.update({ OTP: OTP }, { where: { email: req.body.email } })
        res.status(200).send("Please check your Email and Verify your Account...");

    } catch (err) {
        res.send(`${new Error(err)}`);
    }
};


// verifyOTP by user
exports.verifyOTP = async (req, res) => {
    try {
        const data = await db.otps.findOne({
            where: { email: req.body.email },
            attributes: ["OTP"],
        });
        console.log(data);
        if (req.body.OTP === data.dataValues.OTP) {
            await db.otps.update({ isVerify: 'Yes' }, { where: { email: req.body.email } });
            res.status(200).send("Account was successfully Verified....");
        }
    } catch (err) {
        res.send(`${new Error(err)}`);
    }
};


// Search and Pagination/listing
exports.search = async (req, res) => {
    try {
        console.log('HI');
        let { title, page } = req.query;
        page = parseInt(page);
        if (page == 0) return res.status(404).send(`Resource not found.....`);
        const limit = 2;
        const size = (page - 1) * limit;
        const search = {};
        search.count =
            await db.auths.count({
                where: { email: { [Op.like]: `%${title}%` } },
            });
        search.results = await db.auths.findAll({
            where: { email: { [Op.like]: `%${title}%` } },
            limit: limit,
            offset: size,
        });

        console.log(search.count + "Search Count");
        if (page != 1) search.previous = { page: page - 1 };
        if (page < search.count / limit) search.next = { page: page + 1 };
        if (search.results.length == 0)
            return res.status(404).send(`Resource not found.....`);
        res.status(200).send(search);
    } catch (err) {
        res.status(403).send(`${new Error(err)}`);
    }
};
