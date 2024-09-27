import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { sendMail } from "../services/mail.service";
import jwt from "jsonwebtoken";
import { sendOtp } from "../services/otp.service";

export const getUserByPhoneNoController = async (req: Request, res: Response) => {
    try {
        
        const { phoneNo } = req.params;
        console.log(phoneNo);

        const user = await User.findOne({ phoneNo: phoneNo }).select(["firstname", "lastname", "phoneNo", "email", "profilePicture", "about"]);
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user: user });

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

export const checkUserByPhoneNoController = async (req: Request, res: Response) => {
    try {
        
        const { phoneNo } = req.params;

        const user = await User.findOne({ phoneNo: phoneNo }).select(["phoneNo"]);
        if(!user) {
            return res.status(404).json({ success: false });
        }

        return res.status(200).json({ success: true });

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}