import { Link } from "react-router-dom";

const footerLinks = {
  Shop: {
    "New Arrivals": "/shop?category=New%20Arrivals",
    "Ready To Wear": "/shop?category=Women",
    Accessories: "/shop?category=Men"
  },
  Account: {
    Login: "/login",
    Orders: "/orders",
    Cart: "/cart"
  },
  Studio: {
    "Drop Notes": "/shop",
    Shipping: "/shop"
  }
};

export default function Footer() {
  return (
    <footer className="border-t border-black bg-ink text-paper">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-5xl font-black uppercase tracking-[0.22em]">Mithri</p>
          <p className="mt-4 max-w-sm text-xs font-semibold uppercase leading-6 tracking-[0.12em] text-paper/65">
            Limited merch drops, ready-to-wear staples, and catalog tools for a sharper clothing brand store.
          </p>
        </div>
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-paper/45">{section}</p>
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
