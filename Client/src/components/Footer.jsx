import { Link } from "react-router-dom";

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
        {[
          ["Shop", "New Arrivals", "Ready To Wear", "Accessories"],
          ["Account", "Login", "Orders", "Cart"],
          ["Studio", "Drop Notes", "Shipping", "Admin"]
        ].map((group) => (
          <div key={group[0]}>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-paper/45">{group[0]}</p>
            <div className="mt-4 grid gap-3">
              {group.slice(1).map((item) => (
              <Link
                key={item}
                to={
                  item === "Admin"
                    ? "/admin-login"
                    : item === "Cart"
                      ? "/cart"
                      : item === "Orders"
                        ? "/orders"
                        : "/shop"
                }
                className="text-xs font-black uppercase tracking-[0.18em] hover:text-rust"
              >
                {item}
              </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
