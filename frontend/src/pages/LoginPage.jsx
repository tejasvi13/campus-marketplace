import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import Field from "../components/Field.jsx";
import Notice from "../components/Notice.jsx";
import { loginUser } from "../api/auth.js";

export default function LoginPage({ onSignedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const justVerified = location.state?.verified === true;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = await loginUser(form.email, form.password);
      onSignedIn(data.user);
      navigate("/home");
    } catch (failure) {
      // An unverified account gets sent to the code screen instead of an error.
      if (failure.data && failure.data.needsVerification) {
        navigate("/verify", {
          state: { email: failure.data.email, message: failure.data.message },
        });
        return;
      }
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="page-title">Sign in</h1>
      <p className="page-sub">Use the e-mail address your college gave you.</p>

      {justVerified ? (
        <Notice tone="good">Your e-mail is verified. Sign in to continue.</Notice>
      ) : null}

      <form onSubmit={handleSubmit} className="form">
        <Field
          label="College e-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@student.edu"
          autoComplete="username"
        />

        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Your password"
          autoComplete="current-password"
        />

        <Notice tone="error">{error}</Notice>

        <button className="button" type="submit" disabled={busy}>
          {busy ? "Signing in\u2026" : "Sign in"}
        </button>
      </form>

      <p className="switch">
        First time here? <Link to="/register">Create your account</Link>
      </p>
    </AuthLayout>
  );
}
