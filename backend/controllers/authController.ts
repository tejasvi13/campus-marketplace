import { Request, Response } from "express";

import User, { IUser } from "../models/User";
import { isValidEmailFormat, isAllowedEmail, allowedDomainsText } from "../utils/allowedEmail";
import { generateOtp, getOtpExpiry, printOtp, isOtpExpired } from "../utils/otp";

// What the frontend is allowed to see. The password and the OTP
// never appear in this shape.
export interface PublicUser {
  id: string;
  name: string;
  regNo: string;
  email: string;
  department: string;
  isVerified: boolean;
}

// The bodies we expect to arrive on each route.
interface RegisterBody {
  name?: string;
  regNo?: string;
  email?: string;
  department?: string;
  password?: string;
}

interface VerifyOtpBody {
  email?: string;
  otp?: string;
}

interface ResendOtpBody {
  email?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

// Strips the fields the frontend should never see.
function publicUser(user: IUser): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    regNo: user.regNo,
    email: user.email,
    department: user.department,
    isVerified: user.isVerified,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// POST /api/auth/register
export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const body: RegisterBody = req.body;

    const name: string = String(body.name || "").trim();
    const regNo: string = String(body.regNo || "").trim();
    const email: string = String(body.email || "").toLowerCase().trim();
    const department: string = String(body.department || "").trim();
    const password: string = String(body.password || "");

    if (!name || !regNo || !email || !password) {
      return res.status(400).json({ message: "Fill in your name, register number, e-mail and password." });
    }

    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ message: "That e-mail address does not look right." });
    }

    if (!isAllowedEmail(email)) {
      return res.status(403).json({
        message: "Only college e-mail addresses can register. Use your " + allowedDomainsText() + " address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Use a password of at least 6 characters." });
    }

    const existingEmail: IUser | null = await User.findOne({ email });
    if (existingEmail) {
      // If they started earlier but never verified, let them continue instead of blocking.
      if (!existingEmail.isVerified) {
        const code: string = generateOtp();
        existingEmail.name = name;
        existingEmail.regNo = regNo;
        existingEmail.department = department;
        existingEmail.password = password;
        existingEmail.otpCode = code;
        existingEmail.otpExpiresAt = getOtpExpiry();
        await existingEmail.save();

        printOtp(email, code, "registration restarted");

        return res.status(200).json({
          message: "You had already started signing up. A new code is waiting in the server terminal.",
          email,
        });
      }

      return res.status(409).json({ message: "This e-mail is already registered. Sign in instead." });
    }

    const existingRegNo: IUser | null = await User.findOne({ regNo });
    if (existingRegNo) {
      return res.status(409).json({ message: "This register number is already in use." });
    }

    const code: string = generateOtp();

    const user: IUser = await User.create({
      name,
      regNo,
      email,
      department,
      password,
      isVerified: false,
      otpCode: code,
      otpExpiresAt: getOtpExpiry(),
    });

    printOtp(user.email, code, "new registration");

    return res.status(201).json({
      message: "Account created. Enter the code printed in the server terminal.",
      email: user.email,
    });
  } catch (error: unknown) {
    console.error("register error:", errorMessage(error));
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}

// POST /api/auth/verify-otp
export async function verifyOtp(req: Request, res: Response): Promise<Response> {
  try {
    const body: VerifyOtpBody = req.body;

    const email: string = String(body.email || "").toLowerCase().trim();
    const otp: string = String(body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Enter the six digit code." });
    }

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for that e-mail." });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "This account is already verified. Sign in.", alreadyVerified: true });
    }

    if (isOtpExpired(user.otpExpiresAt)) {
      return res.status(400).json({ message: "That code has expired. Ask for a new one." });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: "That code is not correct. Check the terminal and try again." });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    console.log("Verified ->", user.email);

    return res.status(200).json({ message: "E-mail verified. You can sign in now.", user: publicUser(user) });
  } catch (error: unknown) {
    console.error("verifyOtp error:", errorMessage(error));
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}

// POST /api/auth/resend-otp
export async function resendOtp(req: Request, res: Response): Promise<Response> {
  try {
    const body: ResendOtpBody = req.body;

    const email: string = String(body.email || "").toLowerCase().trim();

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for that e-mail." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified." });
    }

    const code: string = generateOtp();
    user.otpCode = code;
    user.otpExpiresAt = getOtpExpiry();
    await user.save();

    printOtp(user.email, code, "code requested again");

    return res.status(200).json({ message: "New code printed in the server terminal." });
  } catch (error: unknown) {
    console.error("resendOtp error:", errorMessage(error));
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const body: LoginBody = req.body;

    const email: string = String(body.email || "").toLowerCase().trim();
    const password: string = String(body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Enter your e-mail and password." });
    }

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for that e-mail. Register first." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password." });
    }

    if (!user.isVerified) {
      const code: string = generateOtp();
      user.otpCode = code;
      user.otpExpiresAt = getOtpExpiry();
      await user.save();

      printOtp(user.email, code, "login before verification");

      return res.status(403).json({
        message: "Verify your e-mail first. A new code is in the server terminal.",
        needsVerification: true,
        email: user.email,
      });
    }

    return res.status(200).json({ message: "Signed in.", user: publicUser(user) });
  } catch (error: unknown) {
    console.error("login error:", errorMessage(error));
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}
