import { Shield } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login(form);
      if (user?.role !== "admin") {
        throw new Error("That account is not an admin account.");
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-cedar">Admin access</p>
      <h1 className="mt-3 text-4xl font-black">Sign in as admin</h1>
      <p className="mt-3 text-black/60">Use your admin account to open the dashboard and manage the catalog.</p>
      <form className="mt-8 space-y-4 rounded-lg border border-black/10 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
        />
        {error ? <p className="rounded-md bg-rust/10 px-3 py-2 text-sm font-semibold text-rust">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={submitting}>
          <Shield className="mr-2" size={17} />
          {submitting ? "Signing in..." : "Admin sign in"}
        </Button>
      </form>
      <p className="mt-5 text-sm text-black/60">
        Customer login? <Link className="font-bold text-rust hover:text-cedar" to="/login">Sign in here</Link>
      </p>
    </section>
  );
}
