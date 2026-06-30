import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname ?? "/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-black">Sign in</h1>
      <p className="mt-3 text-black/60">Sign in to manage orders, checkout, and your Mithri session.</p>
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
          <LogIn className="mr-2" size={17} />
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-5 text-sm text-black/60">
        New here? <Link className="font-bold text-rust hover:text-cedar" to="/register">Create an account</Link>
      </p>
    </section>
  );
}
