const User = require("../models/User");
const {
  isValidEmailFormat,
  isAllowedEmail,
  allowedDomainsText,
} = require("../utils/allowedEmail");
const { generateOtp, getOtpExpiry, printOtp, isOtpExpired } = require("../utils/otp");

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    regNo: user.regNo,
    email: user.email,
    department: user.department,
    isVerified: user.isVerified,
  };
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const regNo = String(req.body.regNo || "").trim();
    const email = String(req.body.email || "").toLowerCase().trim();
    const department = String(req.body.department || "").trim();
    const password = String(req.body.password || "");

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

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      // If they started earlier but never verified, let them continue instead of blocking.
      if (!existingEmail.isVerified) {
        const code = generateOtp();
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

    const existingRegNo = await User.findOne({ regNo });
    if (existingRegNo) {
      return res.status(409).json({ message: "This register number is already in use." });
    }

    const code = generateOtp();

    const user = await User.create({
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
  } catch (error) {
    console.error("register error:", error.message);
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}

// POST /api/auth/verify-otp
async function verifyOtp(req, res) {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Enter the six digit code." });
    }

    const user = await User.findOne({ email });
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
  } catch (error) {
    console.error("verifyOtp error:", error.message);
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}

// POST /api/auth/resend-otp
async function resendOtp(req, res) {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for that e-mail." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified." });
    }

    const code = generateOtp();
    user.otpCode = code;
    user.otpExpiresAt = getOtpExpiry();
    await user.save();

    printOtp(user.email, code, "code requested again");

    return res.status(200).json({ message: "New code printed in the server terminal." });
  } catch (error) {
    console.error("resendOtp error:", error.message);
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Enter your e-mail and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for that e-mail. Register first." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password." });
    }

    if (!user.isVerified) {
      // Send them straight to the OTP screen with a fresh code.
      const code = generateOtp();
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
  } catch (error) {
    console.error("login error:", error.message);
    return res.status(500).json({ message: "Something broke on the server. Check the terminal." });
  }
}

module.exports = { register, verifyOtp, resendOtp, login };
