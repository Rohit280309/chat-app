import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a firstname"]
    },
    lastName: {
        type: String,
        default: ""
    },
    phoneNo: {
        type: String,
        required: [true, "Please provide a phone no"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"]
    },
    profilePicture: {
        type: String,
        default: `http://${process.env.HOST!}:${process.env.PORT!}/logo/profile.png`
    },
    about: {
        type: String,
        default: "Hey there, I am using Chats"
    },
    contacts: [{
        type: String
    }],
    password: {
        type: String,
        required: [true, "Please provide a valid password"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    otp: Number,
    otpExpiry: Date,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
});

export const User = mongoose.model("User", userSchema);