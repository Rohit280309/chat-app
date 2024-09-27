import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { sendMail } from "../services/mail.service";
import jwt from "jsonwebtoken";
import { sendOtp } from "../services/otp.service";

export const userLoginController = async (req: Request, res: Response) => {
    try {
        
        const { phoneNo, password } = req.body;
        
        
        const user = await User.findOne({ phoneNo: phoneNo });
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: "Please try to login with correct credentials" });
        }
        
        const otp = await sendOtp({ phoneNo });
        if (!otp) {
            return res.status(400).json({ success: false, message: "Error sending otp" });
        }

        user.otp = otp.otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        return res.status(200).json({ success: true, message: "Otp sent", otp: otp.otp })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

export const userSignUpController = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, email, phoneNo, password } = req.body;

        const foundUser1 = await User.find({ email: email });
        if (foundUser1.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" })
        }
        
        const foundUser2 = await User.find({ phoneNo: phoneNo });
        if (foundUser2.length > 0) {
            return res.status(400).json({ success: false, message: "Phone number already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName: firstname,
            lastName: lastname !== undefined ? lastname : "",
            email: email,
            phoneNo: phoneNo,
            password: hashPass
        });

        const otp = await sendOtp({ phoneNo });
        if (!otp) {
            return res.status(400).json({ success: false, message: "Error sending otp" });
        }

        user.otp = otp.otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();
        // const mail = await sendMail({
        //     email: email,
        //     type: "verify",
        //     userId: user._id
        // });
        return res.status(201).json({ success: true, message: "User added Mail sent", otp: otp.otp });

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    try {

        const { token } = req.body;
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid token", success: false });
        }

        user.isEmailVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return res.status(200).json({
            message: "Email Verified!",
            success: true,
        });

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
       
        const { otp, phoneNo } = req.body;

        const user = await User.findOne({ 
            phoneNo: phoneNo,
            otp: otp,
            otpExpiry: { $gt: Date.now() }
        });
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isPhoneVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        const data = { user: { id: user._id, phoneNo: user.phoneNo }};
        const token = jwt.sign(data, process.env.JWT_SECRET!);

        return res.status(200).json({ success: true, token: token });

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

export const resendOtp = async (req: Request, res: Response) => {
    try {
        
        const { phoneNo } = req.body;
        const user = await User.findOne({ phoneNo: phoneNo });
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.otpExpiry || user.otpExpiry.getTime() >= Date.now()) {
            return res.status(400).json({ success: false, message: "Previous otp is still valid" });
        }

        const otp = await sendOtp({ phoneNo });
        if (!otp) {
            return res.status(400).json({ success: false, message: "Error sending otp" });
        }

        user.otp = otp.otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        return res.status(200).json({ success: true, message: "Otp sent", otp: otp.otp })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}