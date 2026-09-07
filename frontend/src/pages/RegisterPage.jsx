import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import Field from "../components/Field.jsx";
import Notice from "../components/Notice.jsx";
import { registerUser } from "../api/auth.js";

const emptyForm = {
  name: "",
  regNo: "",
  email: "",
  department: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const data = await registerUser({
        name: form.name,
        regNo: form.regNo,
        email: form.email,
        department: form.department,
        password: form.password,
      });

      navigate("/verify", { state: { email: data.email, message: data.message } });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="page-title">Create your account</h1>
      <p className="page-sub">
        We check your address against the college list before letting you in.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <Field
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="J Tejasvi"
        />

        <div className="row">
          <Field
            label="Register number"
            name="regNo"
            value={form.regNo}
            onChange={handleChange}
            placeholder="2026611028"
          />
          <Field
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Computer Science"
          />
        </div>

        <Field
          label="College e-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@student.edu"
          hint="Only @student.edu addresses are accepted."
        />

        <div className="row">
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
          <Field
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Type it again"
          />
        </div>

        <Notice tone="error">{error}</Notice>

        <button className="button" type="submit" disabled={busy}>
          {busy ? "Creating account\u2026" : "Create account"}
        </button>
      </form>

      <p className="switch">
        Already registered? <Link to="/">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
