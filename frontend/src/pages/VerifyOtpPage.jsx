import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import Notice from "../components/Notice.jsx";
import OtpInput from "../components/OtpInput.jsx";
import { verifyOtp, resendOtp } from "../api/auth.js";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [good, setGood] = useState(location.state?.message || "");
  const [busy, setBusy] = useState(false);

  if (!email) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter all six digits.");
      return;
    }

    setBusy(true);

    try {
      await verifyOtp(email, code);
      navigate("/", { state: { verified: true } });
    } catch (failure) {
      setError(failure.message);
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setError("");
    setGood("");

    try {
      const data = await resendOtp(email);
      setGood(data.message);
      setCode("");
    } catch (failure) {
      setError(failure.message);
    }
  }

  return (
    <AuthLayout>
      <h1 className="page-title">Verify your e-mail</h1>
      <p className="page-sub">
        We sent a six digit code to <strong>{email}</strong>.
      </p>

      <div className="terminal-note">
        <p className="terminal-note__title">Nothing is being e-mailed yet</p>
        <p>
          This is Stage 1, so the code is printed in the terminal where your
          backend server is running.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <OtpInput value={code} onChange={setCode} />

        <Notice tone="error">{error}</Notice>
        <Notice tone="good">{good}</Notice>

        <button className="button" type="submit" disabled={busy}>
          {busy ? "Checking\u2026" : "Verify and continue"}
        </button>
      </form>

      <p className="switch">
        Did not get a code?{" "}
        <button type="button" className="link-button" onClick={handleResend}>
          Send a new one
        </button>
      </p>

      <p className="switch">
        <Link to="/">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}
