import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-cedar">404</p>
      <h1 className="mt-3 text-5xl font-black">Page not found</h1>
      <p className="mt-4 text-black/60">That Mithri page is not available.</p>
      <Button as={Link} to="/" className="mt-8">Back home</Button>
    </section>
  );
}
