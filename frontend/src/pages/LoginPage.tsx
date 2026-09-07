import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import AuthLayout from "../components/AuthLayout.tsx";
import Field from "../components/Field.tsx";
import Notice from "../components/Notice.tsx";
import { loginUser } from "../api/auth.ts";
import { ApiError } from "../api/client.ts";
import type { LoginForm, LoginState, User } from "../types.ts";

interface LoginPageProps {
  onSignedIn: (user: User) => void;
}

export default function LoginPage({ onSignedIn }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LoginState | null;
  const justVerified: boolean = state?.verified === true;

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = await loginUser(form.email, form.password);
      if (data.user) {
        onSignedIn(data.user);
        navigate("/home");
      }
    } catch (failure: unknown) {
      if (failure instanceof ApiError && failure.data.needsVerification) {
        navigate("/verify", {
          state: { email: failure.data.email, message: failure.data.message },
        });
        return;
      }
      setError(failure instanceof Error ? failure.message : "Something went wrong.");
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
