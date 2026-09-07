
export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getOtpExpiry(): Date {
  const minutes: number = Number(process.env.OTP_VALID_MINUTES || 5);
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function printOtp(email: string, code: string, reason?: string): void {
  const minutes: number = Number(process.env.OTP_VALID_MINUTES || 5);

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

export function isOtpExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
}
