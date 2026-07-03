import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Profile</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cedar">Account</p>
          <h2 className="mt-3 text-2xl font-black">{user?.name}</h2>
          <p className="mt-2 text-black/60">{user?.email}</p>
          <p className="mt-2 text-sm font-bold capitalize text-rust">{user?.role}</p>
          {user?.role === "admin" ? (
            <Button as={Link} className="mt-4" to="/admin">
              Open admin dashboard
            </Button>
          ) : null}
          <Button className="mt-6" variant="secondary" onClick={logout}>Sign out</Button>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cedar">Preferences</p>
          <h2 className="mt-3 text-2xl font-black">Clean catalog alerts</h2>
          <p className="mt-2 text-black/60">Session state is handled through Context API and local storage for a simple demo flow.</p>
        </div>
      </div>
    </section>
  );
}
