import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { resendOtp, userLoginController, userSignUpController, verifyOtp, verifyUser } from "../controllers/auth";

const router = express.Router();

router.post("/login", [
    body("phoneNo", "Please provide a phone number").isLength({ min: 10 }),
    body("password", "Please provide a strong password").isLength({ min: 8 })
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await userLoginController(req, res);
});

router.post("/verify-otp", [
    body("phoneNo", "Please provide a phone number").isLength({ min: 10 }),
    body("otp", "Please provide valid otp").isLength({ min: 6 })
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await verifyOtp(req, res);
});

router.post("/resend-otp", [
    body("phoneNo", "Please provide a phone number").isLength({ min: 10 }),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await resendOtp(req, res);
});

router.post("/signup", [
    body("firstname", "Please provide a first name").isLength({ min: 2 }),
    body("phoneNo", "Please provide a phone number").isLength({ min: 10 }),
    body("email", "Please provide an email").isEmail(),
    body("password", "Please provide a password").isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    await userSignUpController(req, res);
});

router.post("/verify", verifyUser);

export default router;