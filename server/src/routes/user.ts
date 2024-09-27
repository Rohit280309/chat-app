import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { checkUserByPhoneNoController, getUserByPhoneNoController } from "../controllers/user";

const router = express.Router();

router.get("/get-user/:phoneNo", getUserByPhoneNoController);
router.get("/check-user/:phoneNo", checkUserByPhoneNoController);

export default router;