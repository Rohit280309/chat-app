import { Types } from "mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

interface EmailArgs {
    email: string,
    type: "verify" | "forgotPass",
    userId: Types.ObjectId | string
}

export const sendMail = async ({ email, type, userId }: EmailArgs) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userId.toString(), salt);
        const encodedToken = encodeURIComponent(hash);

        if (type === "verify") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hash,
                verifyTokenExpiry: Date.now() + 360000
            });
        } else if (type === "forgotPass") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hash,
                forgotPasswordTokenExpiry: Date.now() + 360000
            })
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.EMAIL!,
                pass: process.env.PASSWORD!
            }
        });

        const mailOptions = {
            from: process.env.EMAIL!,
            to: email,
            subject: type === "verify" ? "Account Verification Email" : "Forgot Password Link",
            html: `<p>Click <a href="${process.env.CLIENT!}/${type === "verify" ? "verify" : "resetPassword"}/${encodedToken}">Here</a> to
                    ${type === "verify" ? "Verify your Email" : "Reset your password"}
                    or Copy paste the link below in your browser. <br>
                    ${process.env.CLIENT!}/${type === "verify" ? "verify" : "resetPassword"}/${encodedToken} </p>`
        }

        return transporter.sendMail(mailOptions, (err: any, info: any) => {
            if (err) {
                console.log(err);
                return { ...err, success: false };
            } else {
                console.log("Email sent: " + info.response);
                return { ...info, success: true };
            }
        });

    } catch (error: any) {
        throw new Error(error.message);
    }
}