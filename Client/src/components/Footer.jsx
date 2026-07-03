import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Footer() {
  const { user, isAuthenticated } = useAuth();
  const ordersPath = user?.role === "admin" ? "/admin/orders" : "/orders";
  const loginLink = isAuthenticated ? (user?.role === "admin" ? "/admin" : "/profile") : "/login";
  const loginLabel = isAuthenticated ? "Account" : "Login";

  const footerLinks = {
    Shop: {
      Tees: "/shop?category=Tees",
      Accessories: "/shop?category=Accessories"
    },
    Account: {
      [loginLabel]: loginLink,
      Orders: ordersPath,
      Cart: "/cart"
    },
    Studio: {
      "Drop Notes": "/shop",
      Shipping: "/shop"
    }
  };

  if (user?.role === "admin") {
    footerLinks.Studio = {
      ...footerLinks.Studio,
      "Admin dashboard": "/admin"
    };
  }

  return (
    <footer className="border-t border-night/35 bg-ink text-paper">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-5xl font-black uppercase tracking-[0.22em]">Mithri</p>
          <p className="mt-4 max-w-sm text-xs font-semibold uppercase leading-6 tracking-[0.12em] text-paper/65">
            Limited merch drops, ready-to-wear staples, and catalog tools for a sharper clothing brand store.
          </p>
        </div>
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-paper/55">{section}</p>
            <div className="mt-4 grid gap-3">
              {Object.entries(links).map(([label, to]) => (
                <Link key={label} to={to} className="text-xs font-black uppercase tracking-[0.18em] hover:text-rust">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
