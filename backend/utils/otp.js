// ---------------------------------------------------------------
// OTP helpers.
//
// Stage 1 does NOT send e-mail. The code is printed in the server
// terminal instead, so you can read it while testing.
// ---------------------------------------------------------------

function generateOtp() {
  // Always six digits, never starting with 0.
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getOtpExpiry() {
  const minutes = Number(process.env.OTP_VALID_MINUTES || 5);
  return new Date(Date.now() + minutes * 60 * 1000);
}

function printOtp(email, code, reason) {
  const minutes = Number(process.env.OTP_VALID_MINUTES || 5);

  console.log("");
  console.log("  ---------------------------------------------");
  console.log("   VERIFICATION CODE");
  console.log("   To      :", email);
  console.log("   Code    :", code);
  console.log("   Expires : in " + minutes + " minutes");
  if (reason) {
    console.log("   Reason  :", reason);
  }
  console.log("  ---------------------------------------------");
  console.log("");
}

function isOtpExpired(expiresAt) {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
}

module.exports = { generateOtp, getOtpExpiry, printOtp, isOtpExpired };
