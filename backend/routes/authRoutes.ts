import express, { Router } from "express";

import { register, verifyOtp, resendOtp, login } from "../controllers/authController";

const router: Router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);

export const authRouter: Router = router;
export default router;