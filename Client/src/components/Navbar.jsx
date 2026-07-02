import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "./Button.jsx";

const shopLinks = [
  { label: "New Arrivals", to: "/shop", preload: () => import("../pages/Shop.jsx") },
  { label: "Ready To Wear", to: "/shop", preload: () => import("../pages/Shop.jsx") },
  { label: "Accessories", to: "/shop", preload: () => import("../pages/Shop.jsx") }
];

const accountLinks = [
  { label: "Orders", to: "/orders", auth: true },
  { label: "Admin", to: "/admin", admin: true }
];

function navClass({ isActive }) {
  return `rounded-sm px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition ${
    isActive ? "text-rust" : "text-ink hover:text-rust"
  }`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, isAuthenticated } = useAuth();
  const visibleAccountLinks = accountLinks.filter((link) => {
    if (link.admin) return user?.role === "admin";
    if (link.auth) return isAuthenticated;
    return true;
  });
  const mobileLinks = [...shopLinks, ...visibleAccountLinks];

  return (
    <header className="sticky top-0 z-40 border-b border-black bg-paper/95 backdrop-blur">
      <div className="border-b border-black bg-ink px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-paper sm:text-[11px] sm:tracking-[0.24em]">
        New Drop Live / Free shipping over Rs 4000 / Limited quantities
      </div>
      <nav className="mx-auto grid max-w-[1500px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button className="px-2 lg:hidden" variant="ghost" aria-label="Menu" onClick={() => setOpen((value) => !value)}>
            <Menu size={22} />
          </Button>
          <Link to="/" className="text-2xl font-black uppercase tracking-[0.18em] sm:text-3xl">
            Mithri
          </Link>
        </div>

        <div className="hidden items-center justify-center gap-1 lg:flex">
          {shopLinks.map((link) => (
            <NavLink
              key={link.label}
              className={navClass}
              to={link.to}
              onFocus={link.preload}
              onMouseEnter={link.preload}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          {visibleAccountLinks.length ? (
            <div className="mr-2 hidden items-center gap-1 border-r border-black/20 pr-3 xl:flex">
              {visibleAccountLinks.map((link) => (
                <NavLink key={link.label} className={navClass} to={link.to}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          ) : null}
          <Link className="focus-ring hidden p-2 hover:text-rust sm:block" to="/shop" aria-label="Search">
            <Search size={20} />
          </Link>
          <Link className="focus-ring relative p-2 hover:text-rust" to="/cart" aria-label="Cart">
            <ShoppingBag size={20} />
            {count ? (
              <span className="absolute -right-1 top-0 bg-rust px-1.5 text-[10px] font-black text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <Link className="focus-ring p-2 hover:text-rust" to={isAuthenticated ? "/profile" : "/login"} aria-label="Profile">
            <UserRound size={20} />
          </Link>
          {!isAuthenticated ? (
            <Link
              className="focus-ring hidden rounded-full border border-black px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] hover:bg-ink hover:text-paper lg:block"
              to="/admin-login"
            >
              Admin
            </Link>
          ) : null}
        </div>
      </nav>
      {open ? (
        <div className="border-t border-black bg-paper px-4 py-3 lg:hidden">
          <div className="grid gap-1">
            {mobileLinks.map((link) => (
              <NavLink
                key={link.label}
                className={navClass}
                to={link.to}
                onClick={() => setOpen(false)}
                onFocus={link.preload}
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <NavLink className={navClass} to="/login" onClick={() => setOpen(false)}>
                Sign in
              </NavLink>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
